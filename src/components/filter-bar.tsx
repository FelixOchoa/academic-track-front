'use client';

import React from 'react';
import { Filter, Layers, Calendar, BookOpen, Building2, RotateCcw } from 'lucide-react';
import i18n from '@/i18n/es.json';

interface FilterBarProps {
  faculty: string;
  program: string;
  period: string;
  semester: string;
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
  onProgramChange,
  onPeriodChange,
  onSemesterChange,
  onResetFilters,
}: FilterBarProps) {
  const t = i18n.filters;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto flex-1 min-w-0">
          
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

          <div 
            onClick={() => document.getElementById('select-programa')?.focus()}
            className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#67a623] transition-all min-w-0 cursor-pointer hover:border-[#67a623]"
          >
            <BookOpen className="w-4 h-4 text-[#67a623] shrink-0 pointer-events-none" />
            <div className="flex flex-col min-w-0 w-full cursor-pointer">
              <label htmlFor="select-programa" className="text-[10px] uppercase font-bold text-slate-400 leading-tight cursor-pointer">
                {t.programLabel}
              </label>
              <select
                id="select-programa"
                value={program}
                onChange={(e) => onProgramChange(e.target.value)}
                className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1"
                title={program}
              >
                <option value="Todos los Programas">{t.allProgramsOption}</option>
                <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
              </select>
            </div>
          </div>

          <div 
            onClick={() => document.getElementById('select-periodo')?.focus()}
            className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#67a623] transition-all min-w-0 cursor-pointer hover:border-[#67a623]"
          >
            <Calendar className="w-4 h-4 text-[#548a1a] shrink-0 pointer-events-none" />
            <div className="flex flex-col min-w-0 w-full cursor-pointer">
              <label htmlFor="select-periodo" className="text-[10px] uppercase font-bold text-slate-400 leading-tight cursor-pointer">
                {t.periodLabel}
              </label>
              <select
                id="select-periodo"
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1"
              >
                <option value="2025-1">2025-1 (Actual)</option>
                <option value="2024-2">2024-2</option>
                <option value="2024-1">2024-1</option>
              </select>
            </div>
          </div>

          <div 
            onClick={() => document.getElementById('select-semestre')?.focus()}
            className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#67a623] transition-all min-w-0 cursor-pointer hover:border-[#67a623]"
          >
            <Layers className="w-4 h-4 text-[#67a623] shrink-0 pointer-events-none" />
            <div className="flex flex-col min-w-0 w-full cursor-pointer">
              <label htmlFor="select-semestre" className="text-[10px] uppercase font-bold text-slate-400 leading-tight cursor-pointer">
                {t.semesterLabel}
              </label>
              <select
                id="select-semestre"
                value={semester}
                onChange={(e) => onSemesterChange(e.target.value)}
                className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1"
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

        </div>

      </div>
    </div>
  );
}
