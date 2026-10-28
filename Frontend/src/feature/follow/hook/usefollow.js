import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../auth/context/auth.context'
import {
    toggleFollowApi, getFollowStatsApi, acceptFollowRequestApi, rejectFollowRequestApi, getPendingRequestsApi
} from '../service/follow.api'
export const usefollow = () => {
    const context = useContext(AuthContext)
    const { errors, setErrors } = context
    const [pendingRequests, setPendingRequests] = useState([])

    const [followStats, setFollowStats] = useState({
        followers: 0,
        following: 0
    });

    async function handleFollowStats() {
        try {
            const data = await getFollowStatsApi();
            setFollowStats({
                followers: data.followers,
                following: data.following
            });
        } catch (err) {
            console.log(err);
             throw err;
        }
    }
    async function handleToggleFollow(userId) {
        try {
            const data = await toggleFollowApi(userId);
            await handleFollowStats();
            return data;

        } catch (err) {
            throw err;
        }

    }
    async function handleAcceptRequest(followId) {
        try {
            await acceptFollowRequestApi(followId);
            await handlegetPendingRequests();
        } catch (err) {
            console.log(err);
            throw err;
        }

    }
    async function handleRejectRequest(followId) {

        try {
            await rejectFollowRequestApi(followId);
            await handlegetPendingRequests();
        } catch (err) {
            console.log(err);
            throw err;
        }

    }
    async function handlegetPendingRequests() {

        try {
            const data = await getPendingRequestsApi();
            setPendingRequests(data.data || []);
        } catch (err) {
            console.log(err);
            throw err;
        }

    }
    useEffect(() => {
        handleFollowStats();
        handlegetPendingRequests();
    }, [])
    return (
        {
            handleToggleFollow,
            handleFollowStats,
            handleAcceptRequest,
            handleRejectRequest,
            handlegetPendingRequests,
            followStats,
            errors,
            setErrors,
            pendingRequests,
            setPendingRequests
        }
    )
}








