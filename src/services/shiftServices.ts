import API_ROUTES from './constant'
import api from '../config/api';

export const getUserShifts = async ({ userId, subscriberId, data }: { userId: string; subscriberId: string; data: any }) => {
    try {
        const response = await api.get(`${API_ROUTES.SHIFTS}/get-user-shifts/${userId}/${subscriberId}`, {
            params: data,
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getAllShifts = async ({ subscriberId, data }: { subscriberId: string; data: any }) => {
    try {
        const response = await api.get(`${API_ROUTES.SHIFTS}/get-all-shifts/${subscriberId}`, {
            params: data,
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};