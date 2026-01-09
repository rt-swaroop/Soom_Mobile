export const ROLES = {
    SYSTEM_SUPER_ADMIN: 'system-super-admin',
    GLOBAL_MANAGER: 'global-manager',
    COMPANY_ADMIN: 'Company-admin',
    USERS: 'user',
} as const;

export type RoleType = keyof typeof ROLES;
