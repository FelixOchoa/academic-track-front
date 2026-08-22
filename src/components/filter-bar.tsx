'use client';

import React from 'react';
import { Filter, Layers, Calendar, BookOpen, Building2 } from 'lucide-react';

interface FilterBarProps {
  facultad: string;
  programa: string;
  periodo: string;
  semestre: string;
  onProgramaChange: (val: string) => void;
  onPeriodoChange: (val: string) => void;
  onSemestreChange: (val: string) => void;
}

export function FilterBar({
  facultad,
  programa,
  periodo,
  semestre,
  onProgramaChange,
  onPeriodoChange,
  onSemestreChange,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Header Indicator */}
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm shrink-0">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
          <span className="whitespace-nowrap">Filtros Globales de Visualización</span>
        </div>

        {/* Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto flex-1 min-w-0">
          
          {/* Item 1: Facultad */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl min-w-0">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight">
                Facultad
              </span>
              <span 
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate"
                title={facultad}
              >
                {facultad}
              </span>
            </div>
          </div>

          {/* Item 2: Selector de Programa */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 transition-all min-w-0">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col min-w-0 w-full">
              <label htmlFor="select-programa" className="text-[10px] uppercase font-bold text-slate-400 leading-tight cursor-pointer">
                Programa Académico
              </label>
              <select
                id="select-programa"
                value={programa}
                onChange={(e) => onProgramaChange(e.target.value)}
                className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1"
                title={programa}
              >
                <option value="Todos los Programas">Todos los Programas (Consolidado)</option>
                <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
              </select>
            </div>
          </div>

          {/* Item 3: Selector de Periodo */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 transition-all min-w-0">
            <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
            <div className="flex flex-col min-w-0 w-full">
              <label htmlFor="select-periodo" className="text-[10px] uppercase font-bold text-slate-400 leading-tight cursor-pointer">
                Periodo Académico
              </label>
              <select
                id="select-periodo"
                value={periodo}
                onChange={(e) => onPeriodoChange(e.target.value)}
                className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1"
              >
                <option value="2025-1">2025-1 (Actual)</option>
                <option value="2024-2">2024-2</option>
                <option value="2024-1">2024-1</option>
              </select>
            </div>
          </div>

          {/* Item 4: Selector de Semestre */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 transition-all min-w-0">
            <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col min-w-0 w-full">
              <label htmlFor="select-semestre" className="text-[10px] uppercase font-bold text-slate-400 leading-tight cursor-pointer">
                Nivel / Semestre
              </label>
              <select
                id="select-semestre"
                value={semestre}
                onChange={(e) => onSemestreChange(e.target.value)}
                className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1"
              >
                <option value="Todos">Todos los Semestres (1-10)</option>
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
