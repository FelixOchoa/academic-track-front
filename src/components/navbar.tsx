'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Download, RefreshCw, UploadCloud } from 'lucide-react';
import i18n from '@/i18n/es.json';

interface NavbarProps {
  onExportReport?: () => void;
  onRefresh?: () => void;
  showUploadButton?: boolean;
}

export function Navbar({ onExportReport, onRefresh, showUploadButton = true }: NavbarProps) {
  const t = i18n.navbar;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1 h-full">
            <Link href="/" className="h-full flex items-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.unicesar.edu.co/wp-content/uploads/2026/08/Logo-Unicesar-2026.webp"
                alt={t.logoAlt}
                title={t.logoTitle}
                className="h-full w-auto object-contain shrink-0 p-0 m-0 cursor-pointer"
              />
            </Link>

            <div className="min-w-0 flex flex-col justify-center py-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span 
                  className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a] rounded border border-[#ceeaad] dark:border-[#355516] leading-none"
                  title={t.cnaBadge}
                >
                  {t.cnaBadge}
                </span>
                <span 
                  className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden lg:inline-flex items-center gap-1"
                  title={t.accreditedBadge}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#67a623]" /> {t.accreditedBadge}
                </span>
              </div>
              <h1 
                className="text-xs sm:text-base md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate mt-0.5 cursor-help"
                title={t.title}
              >
                {t.title}
              </h1>
              <p 
                className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate cursor-help"
                title={t.subtitle}
              >
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1.5 sm:p-2.5 text-slate-600 dark:text-slate-300 hover:text-[#67a623] hover:bg-[#f4faec] dark:hover:bg-slate-800 rounded-xl transition-all"
                title={t.refreshTooltip}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {showUploadButton && (
              <Link
                href="/upload"
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-100 hover:bg-[#f4faec] dark:bg-slate-800 dark:hover:bg-[#152708] text-slate-800 dark:text-slate-100 hover:text-[#67a623] dark:hover:text-[#afdd7a] font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-200 shrink-0"
                title="Cargar y procesar nuevos datos de indicadores"
              >
                <UploadCloud className="w-4 h-4 text-[#67a623]" />
                <span className="hidden sm:inline">Cargar Indicador</span>
                <span className="sm:hidden">Cargar</span>
              </Link>
            )}

            {onExportReport && (
              <button
                onClick={onExportReport}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-[#67a623] to-[#548a1a] hover:from-[#548a1a] hover:to-[#406a16] text-white font-medium text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md hover:shadow-[#67a623]/20 transition-all duration-200 active:scale-95 shrink-0"
                title={t.exportTooltip}
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">{t.exportButton}</span>
                <span className="sm:hidden">{t.exportButtonMobile}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
