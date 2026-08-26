import React from 'react';
import { cn } from '@/lib/utils';
import { Semaforo } from '@/types/metas';

const barColor: Record<Semaforo, string> = {
  Verde: 'bg-[#67a623]',
  Amarillo: 'bg-amber-500',
  Rojo: 'bg-rose-500',
  Gris: 'bg-slate-400',
};

export function ProgressBar({
  value,
  semaforo,
  className,
}: {
  value: number;
  semaforo: Semaforo | string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = barColor[(semaforo as Semaforo) ?? 'Gris'] ?? 'bg-slate-400';

  return (
    <div className={cn('w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all', color)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
