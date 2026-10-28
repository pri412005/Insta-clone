import followModel from "../model/follow.model.js";
import authModel from "../model/auth.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import notificationModel from "../model/notification.model.js";
import { io } from "../../server.js";


export const toggleFollowController = asyncHandler(async (req, res) => {
    const follower = req.user.id;
    const followee = req.params.userid;

    if (follower === followee) {
        throw new AppError("You cannot follow yourself", 400);
    }

    const userExists = await authModel.findById(followee);

    if (!userExists) {
        throw new AppError("User does not exist", 404);
    }

    const existingFollow = await followModel.findOne({
        follower,
        followee
    });

    if (existingFollow) {

        if (existingFollow.status === "pending") {
            return res.status(200).json({
                success: true,
                type: "request-pending",
                message: "Follow request is already pending"
            });
        }

        await followModel.findByIdAndDelete(existingFollow._id);

        return res.status(200).json({
            success: true,
            type: "unfollow",
            message: "User unfollowed successfully"
        });
    }

    const status = userExists.isPrivate ? "pending" : "accepted";

    const follow = await followModel.create({
        follower,
        followee,
        status
    });

    const notification = await notificationModel.create({
        sender: follower,
        receiver: followee,
        type: userExists.isPrivate ? "follow_request" : "follow",
        followId: follow._id
    });
    const populatedNotification = await notificationModel
        .findById(notification._id)
        .populate("sender", "username profileImage");

    io.to(followee).emit("newNotification", populatedNotification);

    return res.status(201).json({
        success: true,
        type: userExists.isPrivate ? "request" : "follow",
        message: userExists.isPrivate
            ? "Follow request sent successfully"
            : "User followed successfully",
        data: follow
    });
});
export const acceptFollowRequest = asyncHandler(async (req, res) => {
    const followId = req.params.followid;
    const followRequest = await followModel.findById(followId);
    if (!followRequest) {
        throw new AppError("Follow request not found", 404);
    }

    if (followRequest.followee.toString() !== req.user.id) {
        throw new AppError("You are not allowed to accept this request", 403);

    }
    if (followRequest.status === "accepted") {
        throw new AppError("Already accepted", 400);
    }
    followRequest.status = "accepted";
    await followRequest.save();
    await notificationModel.deleteMany({
        followId: followRequest._id,
        type: "follow_request",
        receiver: req.user.id
    });

    res.status(200).json({
        success: true,
        message: "Follow request accepted",
        data: followRequest
    });
});
export const rejectFollowRequest = asyncHandler(async (req, res) => {
    const followId = req.params.followid;

    const followRequest = await followModel.findById(followId);
    if (!followRequest) {
        throw new AppError("Follow request not found", 404);
    }

    if (followRequest.followee.toString() !== req.user.id) {
        throw new AppError("You are not allowed to reject this request", 403);
    }

    followRequest.status = "rejected";
    await followRequest.save();
    await notificationModel.deleteMany({
        followId: followRequest._id,
        type: "follow_request",
        receiver: req.user.id
    });

    res.status(200).json({
        success: true,
        message: "Follow request rejected",
        data: followRequest
    });
});
export const getPendingRequests = asyncHandler(async (req, res) => {
    const userid = req.user.id;

    const requests = await followModel
        .find({ followee: userid, status: "pending" })
        .populate("follower", "username email");

    res.status(200).json({
        success: true,
        message: "Pending follow requests",
        data: requests
    });
});
export const getFollowStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const followers = await followModel.countDocuments({
        followee: userId,
        status: "accepted"
    });

    const following = await followModel.countDocuments({
        follower: userId,
        status: "accepted"
    });

    res.status(200).json({
        success: true,
        followers,
        following
    });
});