export interface Permission {
  id: number;
  code: string;
  name: string;
  module: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isSystemRole: boolean;
  createdAt: string;
  usersCount: number;
  permissions: Permission[];
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface UpdateRolePayload {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface UserWithRole {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roleId: number | null;
  roleName: string;
  isActive: boolean;
}
