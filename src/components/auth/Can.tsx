'use client';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface CanProps {
  do?: string;
  doAny?: string[];
  role?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({ do: permission, doAny, role, fallback = null, children }: CanProps) {
  const { hasPermission, hasAnyPermission, hasRole } = usePermissions();

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (doAny && !hasAnyPermission(doAny)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
