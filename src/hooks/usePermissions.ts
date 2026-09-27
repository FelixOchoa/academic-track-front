'use client';

import { useAuth } from '@/context/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  const permissions = user?.permissions || [];
  const role = user?.role || '';
  const isAdmin = role.toLowerCase() === 'administrador';

  const hasPermission = (code: string): boolean => {
    if (!user) return false;
    if (isAdmin) return true; // El Administrador tiene acceso total
    return permissions.includes(code);
  };

  const hasAnyPermission = (codes: string[]): boolean => {
    if (!user) return false;
    if (isAdmin) return true;
    return codes.some((code) => permissions.includes(code));
  };

  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    return role.toLowerCase() === roleName.toLowerCase();
  };

  return {
    permissions,
    role,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasRole,
  };
}
