'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Target, Plus, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-controls';
import { MetasTable } from '@/components/metas/metas-table';
import { MetaFormModal } from '@/components/metas/meta-form-modal';
import { MetaDetailModal } from '@/components/metas/meta-detail-modal';
import { obtenerMetas, obtenerResumenMetas } from '@/services/metasService';
import { MetaDto, ResumenMetasDto } from '@/types/metas';
import { ApiError } from '@/lib/api-client';

const PAGE_SIZE = 10;

export function GoalsManagementTab({ programaId }: { programaId?: number }) {
  const [metas, setMetas] = useState<MetaDto[]>([]);
  const [resumen, setResumen] = useState<ResumenMetasDto | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroProgramaId, setFiltroProgramaId] = useState<string>(
    programaId ? String(programaId) : ''
  );

  const [formOpen, setFormOpen] = useState(false);
  const [metaEnEdicion, setMetaEnEdicion] = useState<MetaDto | null>(null);
  const [metaSeleccionada, setMetaSeleccionada] = useState<MetaDto | null>(null);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const parsedProgramaId = filtroProgramaId ? Number(filtroProgramaId) : undefined;
      const [metasResp, resumenResp] = await Promise.all([
        obtenerMetas({ programaId: parsedProgramaId, page, pageSize: PAGE_SIZE }),
        obtenerResumenMetas(),
      ]);
      setMetas(metasResp.items);
      setTotalPages(metasResp.totalPages || 1);
      setResumen(resumenResp);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo conectar con la API. Verifica que el backend esté corriendo y que NEXT_PUBLIC_API_URL sea correcto.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filtroProgramaId, page]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const totales = resumen?.porPrograma.reduce(
    (acc, p) => ({
      total: acc.total + p.total,
      verde: acc.verde + p.verde,
      amarillo: acc.amarillo + p.amarillo,
      rojo: acc.rojo + p.rojo,
    }),
    { total: 0, verde: 0, amarillo: 0, rojo: 0 }
  ) ?? { total: 0, verde: 0, amarillo: 0, rojo: 0 };

  function handleMetaGuardada(meta: MetaDto) {
    cargarDatos();
    setMetaSeleccionada(meta);
  }

  function handleMetaActualizada(meta: MetaDto) {
    setMetas((prev) => prev.map((m) => (m.id === meta.id ? meta : m)));
    setMetaSeleccionada(meta);
    obtenerResumenMetas().then(setResumen).catch(() => {});
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Metas registradas</span>
            <Target className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{totales.total}</p>
          <p className="text-xs text-emerald-100 mt-1">En todos los programas</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">En meta</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold mt-2 text-slate-900 dark:text-white">{totales.verde}</p>
          <p className="text-xs text-slate-400 mt-1">Semáforo verde</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">En riesgo</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold mt-2 text-slate-900 dark:text-white">{totales.amarillo}</p>
          <p className="text-xs text-slate-400 mt-1">Semáforo amarillo</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">Retrasadas</span>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-extrabold mt-2 text-slate-900 dark:text-white">{totales.rojo}</p>
          <p className="text-xs text-slate-400 mt-1">Semáforo rojo</p>
        </div>
      </div>

      {/* Tabla + filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>
                <Target className="w-5 h-5 text-emerald-600" />
                Gestión de Metas y Objetivos
              </CardTitle>
              <CardDescription>
                Registro, seguimiento y cumplimiento de metas mensuales, semestrales y anuales
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Filtrar por ID de programa"
                className="w-44"
                value={filtroProgramaId}
                onChange={(e) => {
                  setPage(1);
                  setFiltroProgramaId(e.target.value);
                }}
              />
              <Button variant="secondary" size="sm" onClick={cargarDatos} aria-label="Refrescar">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setMetaEnEdicion(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="w-3.5 h-3.5" /> Nueva meta
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-slate-400 py-8 text-center">Cargando metas...</p>
          ) : (
            <>
              <MetasTable
                metas={metas}
                onVerDetalle={setMetaSeleccionada}
                onEditar={(meta) => {
                  setMetaEnEdicion(meta);
                  setFormOpen(true);
                }}
              />

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-xs text-slate-500">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <MetaFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={handleMetaGuardada}
        metaToEdit={metaEnEdicion}
        defaultProgramaId={programaId ?? 1}
      />

      <MetaDetailModal
        open={Boolean(metaSeleccionada)}
        onClose={() => setMetaSeleccionada(null)}
        meta={metaSeleccionada}
        onUpdated={handleMetaActualizada}
      />
    </div>
  );
}
