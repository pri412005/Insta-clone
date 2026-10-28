import { useContext, useEffect } from "react";
import { NotificationContext } from "../context/notification.context";
import { getNotificationsApi, getUnreadCountApi, markAllAsReadApi } from "../service/notification.api.js";
import { socket } from "../../../socket/socket.js";

export const useNotification = () => {

    const {
        notifications,
        setNotifications, unreadCount, setUnreadCount
    } = useContext(NotificationContext);

    async function handleGetNotifications() {
        try {

            const data = await getNotificationsApi();

            setNotifications(data.data);

            return data.data;

        } catch (err) {
            console.log(err);
        }
    }
    async function handleGetUnreadCount() {

        try {

            const data = await getUnreadCountApi();

            setUnreadCount(data.count);

        } catch (err) {

            console.log(err);

        }

    }
    async function handleMarkAllAsRead() {

        try {

            await markAllAsReadApi();

            setUnreadCount(0);

        } catch (err) {

            console.log(err);

        }

    }
    useEffect(() => {

        socket.on("notification", (data) => {

            console.log("🔥 New notification received:", data);

            // 1. UI update instantly
            setNotifications(prev => [data, ...prev]);

            // 2. badge update bhi karna hai
            setUnreadCount(prev => prev + 1);

        });

        return () => {
            socket.off("newNotification");
        };

    }, []);
    return {
        notifications,
        setNotifications,
        handleGetNotifications,
        unreadCount,
        setUnreadCount,
        handleGetUnreadCount,
        handleMarkAllAsRead
    };

};