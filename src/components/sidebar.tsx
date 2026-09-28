'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, LayoutDashboard, ClipboardList, Target, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

interface NavItemConfig {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: string;
  permissionAny?: string[];
}

const NAV_ITEMS: NavItemConfig[] = [
  { href: '/', label: 'Panel de Indicadores', icon: LayoutDashboard, permission: 'INDICATORS_VIEW' },
  { href: '/activities', label: 'Actividades y Evidencias', icon: ClipboardList, permission: 'ACTIVITIES_VIEW' },
  { href: '/goals', label: 'Metas Institucionales', icon: Target, permission: 'GOALS_VIEW' },
  { href: '/roles', label: 'Roles y Permisos', icon: ShieldCheck, permissionAny: ['ROLES_MANAGE', 'USERS_ASSIGN'] },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  className,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
        active
          ? 'bg-gradient-to-r from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
      } ${className ?? ''}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { hasPermission, hasAnyPermission } = usePermissions();

  // No renderizar el Sidebar en la pantalla de login
  if (pathname === '/login') {
    return null;
  }

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.permission && !hasPermission(item.permission)) return false;
    if (item.permissionAny && !hasAnyPermission(item.permissionAny)) return false;
    return true;
  });

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-6 gap-6 shadow-sm">
        <div className="flex items-center gap-2.5 px-2">
          <div className="p-2.5 bg-gradient-to-tr from-[#67a623] to-[#548a1a] rounded-xl text-white shadow-md shadow-[#67a623]/20 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
              AcademicTrack
            </p>
            <p className="text-[11px] font-semibold text-[#548a1a] dark:text-[#afdd7a] truncate">
              Facultad de Ingeniería
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {visibleNavItems.map((item) => (
            <NavLink key={item.href} {...item} active={pathname === item.href} />
          ))}
        </nav>

        {/* Sección de Usuario y Logout */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
          {user && (
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user.fullName || user.username}
                </p>
                <p className="text-[10px] font-semibold text-[#548a1a] dark:text-[#afdd7a] truncate">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <nav className="flex md:hidden sticky top-0 z-40 items-center justify-between px-3 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1 min-w-0">
          {visibleNavItems.map((item) => (
            <NavLink key={item.href} {...item} active={pathname === item.href} className="py-2" />
          ))}
        </div>
        <button
          onClick={logout}
          title="Cerrar sesión"
          className="p-2 ml-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-lg shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </nav>
    </>
  );
}
