import API_ROUTES from './constant';
import api from '../config/api';

export const getNotifications = async (userId: string) => {
    try {
        const response = await api.get(`${API_ROUTES.NOTIFICATIONS}/get-notifications/${userId}`);
        const rawData = response.data?.data || [];

        return rawData.map((item: any) => ({
            ...item,
            description: item.message || '',
            read: item.readBy ? item.readBy.includes(userId) : false,
            time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getAllNotifications = async (subscriberId: string, userId: string) => {
    try {
        const response = await api.get(`${API_ROUTES.NOTIFICATIONS}/get-all-notifications/${subscriberId}`);
        const rawData = response.data?.data || [];

        return rawData.map((item: any) => ({
            ...item,
            description: item.message || '',
            read: item.readBy ? item.readBy.includes(userId) : false,
            time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const markNotificationRead = async (userId: string, notificationId: string) => {
    try {
        const response = await api.put(`${API_ROUTES.NOTIFICATIONS}/mark-read`, { userId, notificationId });
        return response.data?.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const markAllNotificationsRead = async (userId: string) => {
    try {
        const response = await api.put(`${API_ROUTES.NOTIFICATIONS}/mark-all-read`, { userId });
        return response.data?.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const clearNotification = async (userId: string, notificationId: string) => {
    try {
        const response = await api.put(`${API_ROUTES.NOTIFICATIONS}/clear`, { userId, notificationId });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const clearAllNotifications = async (userId: string) => {
    try {
        const response = await api.put(`${API_ROUTES.NOTIFICATIONS}/clear-all`, { userId });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};
