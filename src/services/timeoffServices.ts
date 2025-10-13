import API_ROUTES from './constant'
import api from '../config/api';

export interface TimeOffDataType {
    timeOffType: string;
    startTime?: string | null;
    endTime?: string | null;
    noOfHours?: number | null;
    startDate?: string | null;
    endDate?: string | null;
    noOfDays?: number | null;
    contactNumber?: string | null;
    reason?: string | null;
}

export const getTimeoffHistory = async ({ userId }: { userId: string }) => {
    try {
        const response = await api.get(`${API_ROUTES.TIMEOFF}/get-timeoff-history/${userId}`);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getUpcomingAndPendingTimeoff = async ({ userId, timezone }: { userId: string, timezone: string }) => {
    try {
        const response = await api.get(`${API_ROUTES.TIMEOFF}/get-upcoming-pending/${userId}`, {
            params: { timezone }
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const applyTimeOff = async (data: TimeOffDataType, userId: string, subscriberId: string) => {
    try {
        const response = await api.post(
            `${API_ROUTES.TIMEOFF}/apply-timeoff/${userId}/${subscriberId}`,
            data
        );
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};