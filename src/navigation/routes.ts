export const ROUTES = {
    GET_STARTED: 'GetStarted',
} as const

export type RouteName = typeof ROUTES[keyof typeof ROUTES];