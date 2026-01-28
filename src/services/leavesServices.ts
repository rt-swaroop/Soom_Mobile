import API_ROUTES from './constant'
import api from '../config/api';

export const getLeaveBalance = async (userId: string) => {
    try {
        const response = await api.get(`${API_ROUTES.LEAVES}/get-leave-balance/${userId}`);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getLeaveHistory = async ({ userId }: { userId: string }) => {
    try {
        const response = await api.get(`${API_ROUTES.LEAVES}/get-leave-history/${userId}`);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getUpcomingAndPendingLeaves = async ({ userId, timezone }: { userId: string, timezone: string }) => {
    try {
        const response = await api.get(`${API_ROUTES.LEAVES}/get-upcoming-pending/${userId}`, {
            params: { timezone }
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const applyLeave = async (data: { leaveType: string; startDate: string; endDate: string; noOfDays: number; contactNumber: string; reason: string; }, userId: string, subscriberId: string) => {
    try {
        const response = await api.post(
            `${API_ROUTES.LEAVES}/apply-leave/${userId}/${subscriberId}`,
            data
        );
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getLeaveTypes = async (subscriberId: string) => {
    try {
        const response = await api.get(`${API_ROUTES.LEAVES}/get-leave-types/${subscriberId}`);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};