'use client';

import React from 'react';
import { Target, ShieldAlert } from 'lucide-react';
import { GoalsManagementTab } from '@/components/tabs/goals-management-tab';
import { usePermissions } from '@/hooks/usePermissions';

export default function GoalsPage() {
  const { hasPermission, isAdmin } = usePermissions();
  const canView = isAdmin || hasPermission('GOALS_VIEW');

  if (!canView) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-8 text-center max-w-lg mx-auto shadow-xl">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Acceso Denegado
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tu rol actual no tiene el permiso requerido (`GOALS_VIEW`) para ver o gestionar metas institucionales.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 sm:p-3 bg-gradient-to-tr from-[#67a623] to-[#548a1a] rounded-xl sm:rounded-2xl text-white shadow-md shadow-[#67a623]/20 shrink-0">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                Gestión de Metas Institucionales
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                Registro, seguimiento y cumplimiento de metas de programas académicos
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <GoalsManagementTab />
      </main>
    </div>
  );
}
