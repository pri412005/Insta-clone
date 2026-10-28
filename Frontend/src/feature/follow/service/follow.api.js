import axios from 'axios'
const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})
export const toggleFollowApi = async (userId) => {
    const { data } = await api.post(
        `/follow/toggle/${userId}`
    );
    return data;
};

export const getFollowStatsApi = async () => {
    const { data } = await api.get(`/follow/stats`);
    return data;
};
export const acceptFollowRequestApi = async (followId) => {
    const { data } = await api.patch(
        `/follow/accept/${followId}`
    );

    return data;
};

export const rejectFollowRequestApi = async (followId) => {
    const { data } = await api.patch(
        `/follow/reject/${followId}`
    );

    return data;
};
export const getPendingRequestsApi = async () => {

    const { data } = await api.get(`/follow/requests`);
    return data;
}