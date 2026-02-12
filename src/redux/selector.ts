export const selectUser = (state: any) => state.auth.user;
export const selectAccessToken = (state: any) => state.auth.accessToken;
export const selectRefeshToken = (state: any) => state.auth.refreshToken;
export const selectActiveRole = (state: any) => state.auth.activeRole;
export const selectThemeMode = (state: any) => state.settings.themeMode;

export const selectNotifications = (state: any) => state.notifications.notifications;
export const selectUnreadCount = (state: any) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state: any) => state.notifications.loading;