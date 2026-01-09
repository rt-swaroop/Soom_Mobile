export const ROUTES = {
    GET_STARTED: 'GetStarted',
    LOGIN: 'Login',

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

    ROLE_SELECTION: 'RoleSelection',
    SHIFTS: 'Shifts',
} as const

export type RouteName = typeof ROUTES[keyof typeof ROUTES];