export const ROUTES = {
    GET_STARTED: 'GetStarted',
    LOGIN: 'Login',

    HOME: 'Home',

    LEAVES: 'Leaves',
    LEAVEHISTORY: 'LeaveHistory',
    ADDEDITLEAVES: 'AddEditLeaves',

    TIMEOFF: 'Timeoff',
    TIMEOFFHISTORY: 'TimeoffHistory',
    ADDEDITTIMEOFF: 'AddEditTimeoff',
} as const

export type RouteName = typeof ROUTES[keyof typeof ROUTES];