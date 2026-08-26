'use client';

import React from 'react';
import {
  Filter,
  Layers,
  Calendar,
  BookOpen,
  Building2,
  RotateCcw,
} from 'lucide-react';

import i18n from '@/i18n/es.json';

import type {
  Programa,
  Periodo,
} from '@/services/student-alumni.service';

interface FilterBarProps {
  faculty: string;
  program: string;
  period: string;
  semester: string;

  programas: Programa[];
  periodos: Periodo[];

  onProgramChange: (val: string) => void;
  onPeriodChange: (val: string) => void;
  onSemesterChange: (val: string) => void;
  onResetFilters: () => void;

  /**
   * Permite controlar qué filtros se muestran
   * dependiendo del módulo activo.
   */
  showFaculty?: boolean;
  showPeriod?: boolean;
  showSemester?: boolean;
}

export function FilterBar({
  faculty,
  program,
  period,
  semester,
  programas,
  periodos,
  onProgramChange,
  onPeriodChange,
  onSemesterChange,
  onResetFilters,
  showFaculty = true,
  showPeriod = true,
  showSemester = true,
}: FilterBarProps) {
  const t = i18n.filters;

  const openSelectPicker = (selectId: string) => {
    const element = document.getElementById(
      selectId
    ) as HTMLSelectElement | null;

    if (!element) {
      return;
    }

    try {
      if (
        'showPicker' in element &&
        typeof element.showPicker === 'function'
      ) {
        element.showPicker();
      } else {
        element.focus();
      }
    } catch {
      element.focus();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Título y limpiar */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm">
            <div className="p-2 bg-[#f4faec] dark:bg-[#152708] text-[#67a623] dark:text-[#afdd7a] rounded-lg">
              <Filter className="w-4 h-4" />
            </div>

            <span className="whitespace-nowrap">
              {t.title}
            </span>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#67a623] dark:hover:text-[#afdd7a] hover:bg-[#f4faec] dark:hover:bg-[#152708] rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
            title={t.clearTooltip}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#67a623]" />

            <span>
              {t.clearButton}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto flex-1 min-w-0">
          {/* Facultad */}
          {showFaculty && (
            <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl min-w-0">
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
          )}

          {/* Programa */}
          <div
            onClick={() => openSelectPicker('select-programa')}
            className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#67a623] transition-all min-w-0 cursor-pointer hover:border-[#67a623] select-none"
          >
            <BookOpen className="w-4 h-4 text-[#67a623] shrink-0 pointer-events-none" />

            <div className="flex flex-col min-w-0 w-full pointer-events-none">
              <label
                htmlFor="select-programa"
                className="text-[10px] uppercase font-bold text-slate-400 leading-tight"
              >
                {t.programLabel}
              </label>

              <select
                id="select-programa"
                value={program}
                onChange={(event) =>
                  onProgramChange(event.target.value)
                }
                onClick={(event) =>
                  event.stopPropagation()
                }
                className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1 pointer-events-auto"
                title={program}
              >
                <option value="">
                  {t.allProgramsOption}
                </option>

                {programas.map((item) => (
                  <option
                    key={item.id}
                    value={item.nombre}
                  >
                    {item.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Periodo */}
          {showPeriod && (
            <div
              onClick={() => openSelectPicker('select-periodo')}
              className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#67a623] transition-all min-w-0 cursor-pointer hover:border-[#67a623] select-none"
            >
              <Calendar className="w-4 h-4 text-[#548a1a] shrink-0 pointer-events-none" />

              <div className="flex flex-col min-w-0 w-full pointer-events-none">
                <label
                  htmlFor="select-periodo"
                  className="text-[10px] uppercase font-bold text-slate-400 leading-tight"
                >
                  {t.periodLabel}
                </label>

                <select
                  id="select-periodo"
                  value={period}
                  onChange={(event) =>
                    onPeriodChange(event.target.value)
                  }
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1 pointer-events-auto"
                >
                  <option value="">
                    Seleccionar periodo
                  </option>

                  {periodos.map((item) => {
                    const value = `${item.anio}-${
                      item.semestre === 'I' ? '1' : '2'
                    }`;

                    return (
                      <option
                        key={item.id}
                        value={value}
                      >
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {/* Semestre */}
          {showSemester && (
            <div
              onClick={() => openSelectPicker('select-semestre')}
              className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-[#67a623] transition-all min-w-0 cursor-pointer hover:border-[#67a623] select-none"
            >
              <Layers className="w-4 h-4 text-[#67a623] shrink-0 pointer-events-none" />

              <div className="flex flex-col min-w-0 w-full pointer-events-none">
                <label
                  htmlFor="select-semestre"
                  className="text-[10px] uppercase font-bold text-slate-400 leading-tight"
                >
                  {t.semesterLabel}
                </label>

                <select
                  id="select-semestre"
                  value={semester}
                  onChange={(event) =>
                    onSemesterChange(event.target.value)
                  }
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  className="text-xs font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none cursor-pointer w-full truncate pr-1 pointer-events-auto"
                >
                  <option value="Todos">
                    {t.allSemestersOption}
                  </option>

                  <option value="Sem 1-2">
                    Semestres 1 - 2 (Fundamentación)
                  </option>

                  <option value="Sem 3-4">
                    Semestres 3 - 4 (Básicas Ing.)
                  </option>

                  <option value="Sem 5-6">
                    Semestres 5 - 6 (Profesional)
                  </option>

                  <option value="Sem 7-8">
                    Semestres 7 - 8 (Avanzado)
                  </option>

                  <option value="Sem 9-10">
                    Semestres 9 - 10 (Grado/Prácticas)
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}