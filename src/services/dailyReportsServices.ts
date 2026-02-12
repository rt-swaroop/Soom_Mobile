import API_ROUTES from './constant'
import api from '../config/api';

export const getDailyReports = async ({ userId, formattedDate, timezone }: any) => {
    try {
        const response = await api.get(`${API_ROUTES.DAILYREPORTS}/get-daily-report/${userId}`, {
            params: {
                selectedDate: formattedDate,
                timezone
            }
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getAllDailyReports = async ({ formattedDate, timezone, userId, subscriberId }: any) => {
    try {
        const response = await api.post(`${API_ROUTES.DAILYREPORTS}/get-filtered-daily-reports`, {
            fromDate: formattedDate,
            toDate: formattedDate,
            userId,
            subscriberId,
            timezone
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const submitDailyReport = async (submitData: any, userId: string, timezone: string) => {
    try {
        const response = await api.post(`${API_ROUTES.DAILYREPORTS}/submit-daily-report/${userId}`,
            {
                ...submitData,
                timezone
            }
        );
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};