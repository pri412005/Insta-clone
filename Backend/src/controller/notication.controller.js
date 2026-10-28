import asyncHandler from "../utils/asyncHandler.js";
import notificationModel from "../model/notification.model.js";
 

export const getNotifications = asyncHandler(async (req, res) => {

    const notifications = await notificationModel
        .find({ receiver: req.user.id })
        .populate("sender", " username  profileImage")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: notifications
    });

});
export const getUnreadCount = asyncHandler(async (req, res) => {

    const count = await notificationModel.countDocuments({
        receiver: req.user.id,
        isRead: false
    });

    res.status(200).json({
        success: true,
        count
    });

});
export const markAllAsRead = asyncHandler(async (req, res) => {

    await notificationModel.updateMany(
        {
            receiver: req.user.id,
            isRead: false
        },
        {
            isRead: true
        }
    );

    res.status(200).json({
        success: true,
        message: "All notifications marked as read"
    });

});