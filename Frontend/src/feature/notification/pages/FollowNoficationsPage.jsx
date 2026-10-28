import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hook/useNotification.js";
import "../style/notification.scss";
import PageHeader from "../../../Componenet/Pageheader";
import { usefollow } from "../../follow/hook/usefollow.js";

const FollowNotificationPage = () => {

    const navigate = useNavigate();
    const [processingId, setProcessingId] = useState(null);
    const [toast, setToast] = useState(null);


    const {
        notifications,
        setNotifications,
        handleGetNotifications,
        handleGetUnreadCount,
        handleMarkAllAsRead
    } = useNotification();

    const { handleAcceptRequest,
        handleRejectRequest } = usefollow()

    useEffect(() => {

        const init = async () => {
            await handleGetNotifications();
            await handleMarkAllAsRead();
            await handleGetUnreadCount();
        };

        init();

    }, []);
    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast]);
    const handleAccept = async (e, item) => {
        e.stopPropagation();

        if (!item.followId) {
            setToast({
                type: "error",
                message: "This follow request is invalid or expired."
            });
            return;
        }
        setProcessingId(item._id);

        try {
            await handleAcceptRequest(item.followId);

            setNotifications((prev) =>
                prev.filter((notification) => notification._id !== item._id)
            );
            setToast({
                type: "success",
                message: "Follow request accepted"
            });

        } catch (err) {
            setToast({
                type: "error",
                message: err.response?.data?.message ||
                    "Could not accept the follow request."
            });

        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (e, item) => {
        e.stopPropagation();
        if (!item.followId) {
            setToast({
                type: "error",
                message: "This follow request is invalid or expired."
            });
            return;
        }
        setProcessingId(item._id);


        try {
            await handleRejectRequest(item.followId);

            setNotifications((prev) =>
                prev.filter((notification) => notification._id !== item._id)
            );
            setToast({
                type: "success",
                message: "Follow request rejected"
            });

        } catch (err) {
            setToast({
                type: "error",
                message: "Could not reject the follow request. Please try again."
            });
        } finally {
            setProcessingId(null);
        }
    };

    const formatTimestamp = (dateString) => {
        if (!dateString) return "";

        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;

        const diffInSecs = Math.floor(diffInMs / 1000);
        const diffInMins = Math.floor(diffInSecs / 60);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSecs < 60) return "Just now";
        if (diffInMins < 60) return `${diffInMins}m`;
        if (diffInHours < 24) return `${diffInHours}h`;
        return `${diffInDays}d`;
    };

    const getNotificationText = (type) => {
        switch (type) {
            case "follow":
                return "started following you.";
            case "like":
                return "liked your post.";
            case "comment":
                return "commented on your post.";
            case "follow_request":
                return "requested to follow you.";
            default:
                return "sent a notification.";
        }
    };

    const handleNotificationClick = (item) => {
        if (item.type === "like" || item.type === "comment") {
            navigate(`/post/${item.postId}`);
        } else if (item.type === "follow" || item.type === "follow_accepted") {
            navigate(`/profile/${item.sender?._id}`);
        }
    };

    return (
        <div className="notification-page">

            <PageHeader />

            <div className="notification-container">

                <div className="notification-header">
                    <div className="header-title-area">
                        <h2>Notifications</h2>
                    </div>
                </div>
                {toast && (
                    <div className={`notification-toast ${toast.type}`}>
                        <span>
                            {toast.type === "success" ? "✓" : "!"}
                        </span>
                        <p>{toast.message}</p>
                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            aria-label="Close notification"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="notification-card-wrapper">

                    {!notifications || notifications.length === 0 ? (
                        <div className="notification-empty">
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((item) => (
                            <div
                                className="notification-row"
                                key={item._id}
                                onClick={() => handleNotificationClick(item)}
                            >
                                <div className="notification-meta">

                                    <div className="avatar-container">
                                        <img
                                            src={item.sender?.profileImage}
                                            alt={item.sender?.username}
                                            className="user-avatar"
                                        />
                                    </div>

                                    <div className="text-container">
                                        <div className="text-content">

                                            <span className="user-name">
                                                {item.sender?.username}
                                            </span>

                                            <span className="activity-text">
                                                {" "}
                                                {getNotificationText(item.type)}
                                            </span>

                                            <span className="time-stamp">
                                                {formatTimestamp(item.createdAt)}
                                            </span>

                                        </div>
                                    </div>
                                    {item.type === "follow_request" && (
                                        <div className="follow-request-actions">
                                            <button
                                                type="button"
                                                disabled={processingId === item._id}
                                                onClick={(e) => handleAccept(e, item)}
                                            >
                                                {processingId === item._id ? "Processing..." : "Accept"}
                                            </button>
                                            <button
                                                type="button"
                                                disabled={processingId === item._id}
                                                onClick={(e) => handleReject(e, item)}
                                            >
                                                {processingId === item._id ? "Processing..." : "Reject"}
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))
                    )}

                </div>

            </div>

        </div>
    );
};

export default FollowNotificationPage;