'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, LayoutDashboard, ClipboardList } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Panel de Indicadores', icon: LayoutDashboard },
  { href: '/activities', label: 'Actividades y Evidencias', icon: ClipboardList },
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
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      } ${className ?? ''}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-6 gap-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl text-white shadow-md shadow-emerald-500/20 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
              AcademicTrack
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Fac. Ingeniería y Tecnologías
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} active={pathname === item.href} />
          ))}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <nav className="flex md:hidden sticky top-0 z-40 items-center gap-1.5 overflow-x-auto px-3 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} active={pathname === item.href} className="py-2" />
        ))}
      </nav>
    </>
  );
}
