const BASE_URL = 'https://soom-api.remote-teams.in/api/soom';
// const BASE_URL = 'http://10.0.2.2:4000/api/soom';

const API_ROUTES = {
    AUTH: `${BASE_URL}/auth`,
    ATTENDANCE: `${BASE_URL}/attendance`,
    DAILYREPORTS: `${BASE_URL}/dailyreports`,
    LEAVES: `${BASE_URL}/leaves`,
    SHIFTS: `${BASE_URL}/shift`,
    TIMEOFF: `${BASE_URL}/timeoff`,
    NOTIFICATIONS: `${BASE_URL}/notifications`,
    APP_VERSION: `${BASE_URL}/app-version`,
};

export default API_ROUTES;
