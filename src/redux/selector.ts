export const selectUser = (state: { auth: { user: any; }; }) => state.auth.user;
export const selectAccessToken = (state: { auth: { accessToken: any; }; }) => state.auth.accessToken;
export const selectRefeshToken = (state: { auth: { refreshToken: any; }; }) => state.auth.refreshToken;