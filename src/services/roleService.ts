import { http } from '@/api/http';
import {
  Role,
  Permission,
  CreateRolePayload,
  UpdateRolePayload,
  UserWithRole,
} from '@/types/roles';

export const roleService = {
  async getRoles(): Promise<Role[]> {
    return await http.get<Role[]>('/api/roles');
  },

  async getRole(id: number): Promise<Role> {
    return await http.get<Role>(`/api/roles/${id}`);
  },

  async createRole(payload: CreateRolePayload): Promise<Role> {
    return await http.post<Role>('/api/roles', payload);
  },

  async updateRole(id: number, payload: UpdateRolePayload): Promise<Role> {
    return await http.put<Role>(`/api/roles/${id}`, payload);
  },

  async deleteRole(id: number): Promise<void> {
    await http.delete<void>(`/api/roles/${id}`);
  },

  async getPermissions(): Promise<Permission[]> {
    return await http.get<Permission[]>('/api/roles/permissions');
  },

  async getUsers(): Promise<UserWithRole[]> {
    return await http.get<UserWithRole[]>('/api/roles/users');
  },

  async assignUserRole(userId: number, roleId: number): Promise<UserWithRole> {
    return await http.put<UserWithRole>(`/api/roles/users/${userId}`, { roleId });
  },
};
