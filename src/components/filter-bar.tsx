'use client';

import React from 'react';
import { Filter, Layers, Calendar, BookOpen, Building2, RotateCcw } from 'lucide-react';
import i18n from '@/i18n/es.json';

interface ProgramaOption {
  id: string | number;
  nombre: string;
}

interface PeriodoOption {
  id: string | number;
  anio: number;
  semestre: string;
}

interface FilterBarProps {
  faculty: string;
  program: string;
  period: string;
  semester: string;
  activeTab?: string;
  availablePeriods?: string[];
  programas?: ProgramaOption[];
  periodos?: PeriodoOption[];
  onProgramChange: (val: string) => void;
  onPeriodChange: (val: string) => void;
  onSemesterChange: (val: string) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  faculty,
  program,
  period,
  semester,
  activeTab = 'academic',
  availablePeriods,
  programas = [],
  periodos = [],
  onProgramChange,
  onPeriodChange,
  onSemesterChange,
  onResetFilters,
}: FilterBarProps) {
  const t = i18n.filters;

  const openSelectPicker = (selectId: string) => {
    const el = document.getElementById(selectId) as HTMLSelectElement;
    if (el && !el.disabled) {
      try {
        if ('showPicker' in el && typeof el.showPicker === 'function') {
          el.showPicker();
        } else {
          el.focus();
        }
      } catch {
        el.focus();
      }
    }
  };

  const hasPeriods = (availablePeriods && availablePeriods.length > 0) || (periodos && periodos.length > 0);
  
  let periodOptions: string[] = [];
  if (availablePeriods && availablePeriods.length > 0) {
    periodOptions = [...availablePeriods].reverse();
  } else if (periodos && periodos.length > 0) {
    periodOptions = periodos.map(p => `${p.anio}-${p.semestre === 'I' ? '1' : '2'}`);
  }

  // Hide Semester filter for Academic tab since SACES metrics are reported strictly by Academic Period (2018-1 to 2025-1)
  const showSemesterFilter = activeTab !== 'academic';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm">
            <div className="p-2 bg-[#f4faec] dark:bg-[#152708] text-[#67a623] dark:text-[#afdd7a] rounded-lg">
              <Filter className="w-4 h-4" />
            </div>
            <span className="whitespace-nowrap">{t.title}</span>
          </div>

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#67a623] dark:hover:text-[#afdd7a] hover:bg-[#f4faec] dark:hover:bg-[#152708] rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
            title={t.clearTooltip}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#67a623]" />
            <span>{t.clearButton}</span>
          </button>
        </div>

        <div className={`grid grid-cols-1 ${showSemesterFilter ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-3 w-full lg:w-auto flex-1 min-w-0`}>
          
          {/* Facultad Filter */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl min-w-0 cursor-default">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight">
                {t.facultyLabel}
              </span>
              <span 
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate"
                title={faculty}
              >
                {faculty}
              </span>
            </div>
          </div>

          {/* Programa Filter */}
          <div 
            onClick={() => openSelectPicker('select-programa')}
            className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#67a623] transition-all min-w-0 cursor-pointer hover:border-[#67a623] select-none"
          >
            <BookOpen className="w-4 h-4 text-[#67a623] shrink-0 pointer-events-none" />
            <div className="flex flex-col min-w-0 w-full pointer-events-none">
              <label htmlFor="select-programa" className="text-[10px] uppercase font-bold text-slate-400 leading-tight pointer-events-none">
                {t.programLabel}
              </label>
              <select
                id="select-programa"
                value={program}
                onChange={(e) => onProgramChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1 pointer-events-auto"
                title={program}
              >
                <option value="Todos los Programas">{t.allProgramsOption}</option>
                <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                {programas.map((item) => (
                  <option key={item.id} value={item.nombre}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Periodo Académico Filter */}
          <div 
            onClick={() => openSelectPicker('select-periodo')}
            className={`flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#67a623] transition-all min-w-0 select-none ${
              hasPeriods ? 'cursor-pointer hover:border-[#67a623]' : 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <Calendar className={`w-4 h-4 shrink-0 pointer-events-none ${hasPeriods ? 'text-[#548a1a]' : 'text-slate-400'}`} />
            <div className="flex flex-col min-w-0 w-full pointer-events-none">
              <label htmlFor="select-periodo" className="text-[10px] uppercase font-bold text-slate-400 leading-tight pointer-events-none">
                {t.periodLabel}
              </label>
              <select
                id="select-periodo"
                value={hasPeriods ? period : ''}
                disabled={!hasPeriods}
                onChange={(e) => onPeriodChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className={`text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none w-full truncate pr-1 pointer-events-auto ${
                  hasPeriods ? 'cursor-pointer' : 'cursor-not-allowed text-slate-400 dark:text-slate-500'
                }`}
              >
                {!hasPeriods ? (
                  <option value="" disabled>Sin periodos cargados</option>
                ) : (
                  periodOptions.map((p, idx) => (
                    <option key={p} value={p}>
                      {p} {idx === 0 ? '(Actual)' : ''}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Optional Nivel / Semestre Filter */}
          {showSemesterFilter && (
            <div 
              onClick={() => openSelectPicker('select-semestre')}
              className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#67a623] transition-all min-w-0 cursor-pointer hover:border-[#67a623] select-none"
            >
              <Layers className="w-4 h-4 text-[#67a623] shrink-0 pointer-events-none" />
              <div className="flex flex-col min-w-0 w-full pointer-events-none">
                <label htmlFor="select-semestre" className="text-[10px] uppercase font-bold text-slate-400 leading-tight pointer-events-none">
                  {t.semesterLabel}
                </label>
                <select
                  id="select-semestre"
                  value={semester}
                  onChange={(e) => onSemesterChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1 pointer-events-auto"
                >
                  <option value="Todos">{t.allSemestersOption}</option>
                  <option value="Sem 1-2">Semestres 1 - 2 (Fundamentación)</option>
                  <option value="Sem 3-4">Semestres 3 - 4 (Básicas Ing.)</option>
                  <option value="Sem 5-6">Semestres 5 - 6 (Profesional)</option>
                  <option value="Sem 7-8">Semestres 7 - 8 (Avanzado)</option>
                  <option value="Sem 9-10">Semestres 9 - 10 (Grado/Prácticas)</option>
                </select>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
