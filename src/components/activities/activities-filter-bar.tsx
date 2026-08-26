'use client';

import React from 'react';
import { Filter, Plus } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ACTIVITY_TYPE_OPTIONS } from '@/api/activities';
import { Program } from '@/api/programs';

interface ActivitiesFilterBarProps {
  programs: Program[];
  programId: string;
  type: string;
  onProgramIdChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onNewActivity: () => void;
}

export function ActivitiesFilterBar({
  programs,
  programId,
  type,
  onProgramIdChange,
  onTypeChange,
  onNewActivity,
}: ActivitiesFilterBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm shrink-0">
          <div className="p-2 bg-[#f4faec] dark:bg-[#152708] text-[#67a623] dark:text-[#afdd7a] rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
          <span className="whitespace-nowrap">Filtros</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:max-w-md">
          <Select value={programId} onChange={(e) => onProgramIdChange(e.target.value)}>
            <option value="">Todos los programas</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>

          <Select value={type} onChange={(e) => onTypeChange(e.target.value)}>
            <option value="">Todos los tipos</option>
            {ACTIVITY_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <Button onClick={onNewActivity} className="shrink-0">
          <Plus className="w-4 h-4" />
          Nueva Actividad
        </Button>
      </div>
    </div>
  );
}
