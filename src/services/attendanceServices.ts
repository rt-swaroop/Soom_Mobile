import API_ROUTES from './config'
import api from '../config/api';

interface AttendanceParams {
    userId: string;
    startDate: string;
    endDate: string;
    timeZone: string;
}

export const getAttendance = async ({ userId, startDate, endDate, timeZone }: AttendanceParams) => {
    try {
        const response = await api.get(`${API_ROUTES.ATTENDANCE}/get-attendance/${userId}`, {
            params: { startDate, endDate, timeZone },
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const postAttendance = async (data: { attendanceStatus: string; place: string; time: string; timeZone: string }, userId: string) => {
    try {
        const response = await api.post(
            `${API_ROUTES.ATTENDANCE}/post-attendance/${userId}`,
            data
        );
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};  