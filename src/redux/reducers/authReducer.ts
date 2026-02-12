import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    activeRole: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        updateAccessToken(state, action) {
            state.accessToken = action.payload;
        },
        setActiveRole(state, action) {
            state.activeRole = action.payload;
        },
        logoutUser(state) {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.activeRole = null;
        }
    },
});

export const { setUser, updateAccessToken, logoutUser, setActiveRole } = authSlice.actions;

export default authSlice.reducer;
