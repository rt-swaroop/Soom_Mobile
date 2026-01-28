import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
    _id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: string;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.read).length;
        },
        updateNotificationRead: (state, action: PayloadAction<string>) => {
            const index = state.notifications.findIndex(n => n._id === action.payload);
            if (index !== -1 && !state.notifications[index].read) {
                state.notifications[index].read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => { n.read = true; });
            state.unreadCount = 0;
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n._id === action.payload);
            if (notification && !notification.read) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            state.notifications = state.notifications.filter(n => n._id !== action.payload);
        },
        clearAll: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setNotifications,
    updateNotificationRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    setLoading
} = notificationSlice.actions;
export default notificationSlice.reducer;
