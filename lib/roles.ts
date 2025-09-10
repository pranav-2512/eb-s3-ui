export type UserRole = 'guest' | 'user' | 'admin';

export interface UserPermissions {
  canView: boolean;
  canDownload: boolean;
  canUpload: boolean;
  canCreateFolder: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  guest: {
    canView: true,
    canDownload: false,
    canUpload: false,
    canCreateFolder: false,
    canDelete: false,
    canManageUsers: false,
  },
  user: {
    canView: true,
    canDownload: true,
    canUpload: true,
    canCreateFolder: true,
    canDelete: false,
    canManageUsers: false,
  },
  admin: {
    canView: true,
    canDownload: true,
    canUpload: true,
    canCreateFolder: true,
    canDelete: true,
    canManageUsers: true,
  },
};

export function getUserPermissions(role: UserRole): UserPermissions {
  return ROLE_PERMISSIONS[role];
}

export function isAdmin(userId: string): boolean {
  // Replace with your actual admin user ID
  const ADMIN_USER_ID = process.env.ADMIN_USER_ID || 'user_2your_admin_id_here';
  return userId === ADMIN_USER_ID;
}

export function getRoleFromUserId(userId: string): UserRole {
  if (isAdmin(userId)) {
    return 'admin';
  }
  // For now, default to user. In a real app, you'd check a database
  return 'user';
}
