'use client';

import React from 'react';
import { GraduationCap, ShieldCheck, Download, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onExportReport?: () => void;
  onRefresh?: () => void;
}

export function Navbar({ onExportReport, onRefresh }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.5rem] py-2.5 sm:py-0 sm:h-20 gap-2">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="p-2.5 sm:p-3 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl sm:rounded-2xl text-white shadow-md shadow-emerald-500/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 leading-none">
                  Autoevaluación & CNA
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Sistema Acreditado
                </span>
              </div>
              <h1 className="text-sm sm:text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate sm:whitespace-normal mt-0.5">
                Panel de Indicadores Académicos
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                Facultad de Ingeniería y Tecnologías
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 sm:p-2.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                title="Actualizar Datos Mock"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onExportReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md hover:shadow-emerald-500/20 transition-all duration-200 active:scale-95"
              title="Exportar Informe"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Exportar Informe</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
