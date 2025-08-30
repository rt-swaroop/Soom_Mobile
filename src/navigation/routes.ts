export const ROUTES = {
    GET_STARTED: 'GetStarted',
    LOGIN: 'Login',
    HOME: 'Home',
} as const

export type RouteName = typeof ROUTES[keyof typeof ROUTES];