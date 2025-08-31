import API_ROUTES from './config'
import api from '../config/api';

export const loginUser = async (data: { companyCode: string; userEmail: string; password: string; deviceType: string; }) => {
    try {
        const response = await api.post(`${API_ROUTES.AUTH}/login`, data);
        return response;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};

export const refreshToken = async (refreshToken: string) => {
    try {
        const response = await api.post(`${API_ROUTES.AUTH}/refresh-token`, { token: refreshToken });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};  