import React from 'react';
import { Pencil } from 'lucide-react';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SemaforoBadge, estadoLabel } from '@/components/metas/semaforo-badge';
import { MetaDto } from '@/types/metas';

export function MetasTable({
  metas,
  onVerDetalle,
  onEditar,
}: {
  metas: MetaDto[];
  onVerDetalle: (meta: MetaDto) => void;
  onEditar: (meta: MetaDto) => void;
}) {
  if (metas.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic py-6 text-center">
        No hay metas registradas para este filtro todavía.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40">
            <th className="py-3 px-4 rounded-l-xl">Meta</th>
            <th className="py-3 px-4">Responsable</th>
            <th className="py-3 px-4">Fecha límite</th>
            <th className="py-3 px-4 w-48">Avance</th>
            <th className="py-3 px-4">Estado</th>
            <th className="py-3 px-4 rounded-r-xl text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {metas.map((meta) => (
            <tr
              key={meta.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
              onClick={() => onVerDetalle(meta)}
            >
              <td className="py-3.5 px-4">
                <p className="font-semibold text-slate-900 dark:text-white">{meta.nombre}</p>
                <p className="text-[11px] text-slate-400 font-medium">{meta.indicadorNombre}</p>
              </td>
              <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{meta.responsable}</td>
              <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{meta.fechaLimite}</td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <ProgressBar value={meta.porcentajeCumplimiento} semaforo={meta.semaforo} className="w-24" />
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                    {meta.porcentajeCumplimiento}%
                  </span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex flex-col gap-1 items-start">
                  <SemaforoBadge semaforo={meta.semaforo} />
                  <span className="text-[10px] text-slate-400 font-medium">{estadoLabel(meta.estado)}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditar(meta);
                  }}
                  className="p-1.5 text-slate-400 hover:text-[#67a623] rounded-lg hover:bg-[#f4faec] dark:hover:bg-[#152708] transition-colors"
                  aria-label="Editar meta"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
