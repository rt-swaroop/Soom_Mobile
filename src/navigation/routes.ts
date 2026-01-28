export const ROUTES = {
    GET_STARTED: 'GetStarted',
    LAUNCHER: 'Launcher',
    UPDATE_REQUIRED: 'UpdateRequired',
    LOGIN: 'Login',
    ROLE_SELECTION: 'RoleSelection',

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