import "dotenv/config";
import authModel from "../model/auth.model.js";
import { sendOTP } from "../controller/otp.controller.js";
import generateToken from "../utils/token.js";
import redis from "../config/cache.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import ImageKit from "imagekit";
import PostModel from "../model/post.model.js";
import followModel from "../model/follow.model.js";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const sendOTPForRegistration = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
        return next(new AppError("All fields are required", 400));
    }
    const existingUser = await authModel.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })
    if (existingUser) {
        return next(new AppError(
            existingUser.email === email ? "Email already exists" : "Username already exists",
            409
        ));
    }

    await sendOTP(email, username, password);

    res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email"
    });
});
export const loginController = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Email and password required", 400));
    }

    const user = await authModel
        .findOne({ email: email.toLowerCase() })
        .select("+password");

    if (!user) return next(new AppError("Invalid email or password", 401));
    if (!user.isVerified) return next(new AppError("Please verify your account first", 401));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new AppError("Invalid email or password", 401));

    const token = generateToken(user._id);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "User login successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
});
export const logoutController = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    res.clearCookie("token");

    await redis.set(
        `insta:personal:blacklist:${token}`,
        Date.now().toString(),
        "EX",
        60 * 60
    );
    res.status(200).json({ message: "Logout successfully" });
});
export const getCurrentUser = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await authModel.findById(userId).lean();

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user: {
            ...user,
        }
    });
});
export const updateProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { username, bio, isPrivate } = req.body;
    const file = req.file;


    const user = await authModel.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    user.username = username || user.username;
    user.bio = bio || user.bio;
    if (isPrivate !== undefined) {
        user.isPrivate = isPrivate === true || isPrivate === false ? isPrivate : user.isPrivate;
    }


    if (file) {
        try {
            const uploadResponse = await imagekit.upload({
                file: file.buffer,
                fileName: `profile-${userId}-${Date.now()}`
            });
            user.profileImage = uploadResponse.url;
        } catch (err) {
            return next(new AppError("Image upload failed", 500));
        }
    }

    await user.save();

    res.status(200).json({
        success: true,
        user: {
            ...user.toObject(),
        }
    });
});
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const { search = "", page = 1, limit = 10 } = req.query;

    if (!search.trim()) {
        return res.status(200).json({
            success: true,
            count: 0,
            totalUsers: 0,
            totalPages: 0,
            currentPage: Number(page),
            users: [] 
        });
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {
        _id: { $ne: req.user.id },
        $or: [
            {
                username: {
                    $regex: search.trim(), 
                    $options: "i"
                }
            }
        ]
    };

  
    const [users, totalUsers] = await Promise.all([
        authModel.find(query).select("-password").skip(skip).limit(limitNumber).lean(),
        authModel.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        count: users.length,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limitNumber),
        currentPage: pageNumber,
        users
    });
});
export const getUserById = asyncHandler(async (req, res) => {

    const user = await authModel
        .findById(req.params.id)
        .select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const posts = await PostModel.find({
        user: req.params.id
    });

    const followersCount = await followModel.countDocuments({
        followee: req.params.id,
        status: "accepted"
    });
    const followingCount = await followModel.countDocuments({
        follower: req.params.id,
        status: "accepted"
    });

    res.status(200).json({
        success: true,

        user: {
            ...user._doc,

            postsCount: posts.length,

            followersCount,

            followingCount
        },

        posts
    });

});