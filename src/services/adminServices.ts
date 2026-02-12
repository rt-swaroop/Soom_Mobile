import API_ROUTES from './constant';
import api from '../config/api';

export const getAttendanceStats = async (subscriberId: string, currentDateTime: string, timeZone: string) => {
    try {
        const response = await api.get(`${API_ROUTES.STATISTICS}/get-attendance/${subscriberId}`, {
            params: {
                currentDateTime,
                timeZone
            }
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getDashboardDetails = async (subscriberId: string, currentDateTime: string, timeZone: string) => {
    try {
        const response = await api.get(`${API_ROUTES.STATISTICS}/get-dashboard-details/${subscriberId}`, {
            params: {
                currentDateTime,
                timeZone
            }
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getAllAttendance = async (subscriberId: string, params: { startDate: string, endDate: string, timeZone: string, userId?: string }) => {
    try {
        const response = await api.get(`${API_ROUTES.ATTENDANCE}/get-all-attendance/${subscriberId}`, {
            params
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getUsersList = async (companyId: string) => {
    try {
        const response = await api.get(`${API_ROUTES.USER}/get-users-list/${companyId}`);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getAppliedLeaves = async (subscriberId: string) => {
    try {
        const response = await api.get(`${API_ROUTES.LEAVES}/applied-leaves/${subscriberId}`);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const getAppliedTimeOff = async (subscriberId: string) => {
    try {
        const response = await api.get(`${API_ROUTES.LEAVES}/applied-timeOff/${subscriberId}`);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const approveRejectLeave = async (leaveId: string, status: 'Approved' | 'Rejected', comment?: string) => {
    try {
        const response = await api.post(`${API_ROUTES.LEAVES}/approve-reject-leave/${leaveId}`, {
            status,
            comment
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const approveRejectTimeOff = async (timeOffId: string, status: 'Approved' | 'Rejected', comment?: string) => {
    try {
        const response = await api.post(`${API_ROUTES.LEAVES}/approve-reject-timeOff/${timeOffId}`, {
            status,
            comment
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};
