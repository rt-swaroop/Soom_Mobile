export const ROUTES = {
    GET_STARTED: 'GetStarted',
    LAUNCHER: 'Launcher',
    UPDATE_REQUIRED: 'UpdateRequired',
    LOGIN: 'Login',
    ROLE_SELECTION: 'RoleSelection',
    ADMIN_DASHBOARD: 'AdminDashboard',
    ADMIN_ATTENDANCE: 'AdminAttendance',
    ADMIN_LEAVES: 'AdminLeaves',
    ADMIN_USERS: 'AdminUsers',
    ADMIN_SHIFTS: 'AdminShifts',
    ADMIN_DAILY_REPORTS: 'AdminDailyReports',
    ADMIN_NAV: 'AdminNav',

    HOME: 'Home',

    LEAVESTACK: 'LeavesStack',
    LEAVES: 'Leaves',
    LEAVEHISTORY: 'LeaveHistory',
    ADDEDITLEAVES: 'AddEditLeaves',

    TIMEOFF: 'Timeoff',
    TIMEOFFHISTORY: 'TimeoffHistory',
    ADDEDITTIMEOFF: 'AddEditTimeoff',

    DAILYREPORTS: 'DailyReports',
    SUBMITDAILYREPORT: 'SubmitDailyReport',

    SHIFTS: 'Shifts',

    PROFILE: 'Profile',
    PROFILE_DETAILS: 'ProfileDetails',
    NOTIFICATIONS: 'Notifications',
    NOTIFICATION_PREFERENCES: 'NotificationPreferences',
    PERMISSION_MANAGER: 'PermissionManager',
} as const

export type RouteName = typeof ROUTES[keyof typeof ROUTES];