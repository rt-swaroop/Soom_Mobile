import axios from "axios";

import store from '../redux/store';
import API_ROUTES from '../services/constant'
import { logoutUser, setUser, updateAccessToken } from "../redux/reducers/authReducer";
import { selectAccessToken, selectRefeshToken } from "../redux/selector";

const api = axios.create({
    baseURL: API_ROUTES.AUTH,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
    async (config) => {
        const state = store.getState();
        const token = selectAccessToken(state);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const state = store.getState();
        const refreshToken = selectRefeshToken(state);

        // if access token expired & we have refresh token
        if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(`${API_ROUTES.AUTH}/refresh-token`, {
                    token: refreshToken,
                });

                const { accessToken, user } = refreshResponse.data;

                // update redux with new accessToken + user
                store.dispatch(
                    setUser({
                        user,
                        accessToken,
                        refreshToken, // keep old refresh token
                    })
                );

                // retry the original request with new access token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (err) {
                console.error("Refresh token failed:", err);
                store.dispatch(logoutUser());
                // optionally navigate to login screen here
            }
        }

        return Promise.reject(error);
    }
);


export default api;