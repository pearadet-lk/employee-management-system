export const ROLES = {
  Admin: 'Admin',
  HR: 'HR',
  Viewer: 'Viewer'
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
