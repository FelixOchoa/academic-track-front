import React, { useState } from 'react';
import { FileText, Link as LinkIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/form-controls';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SemaforoBadge, estadoLabel } from '@/components/metas/semaforo-badge';
import {
  actualizarAvanceMeta,
  agregarEvidencia,
  cancelarMeta,
} from '@/services/metasService';
import { MetaDto, EstadoMeta } from '@/types/metas';

const ESTADOS_MANUALES: EstadoMeta[] = [
  'NoIniciada',
  'EnProgreso',
  'Cumplida',
  'Retrasada',
  'Cancelada',
];

export function MetaDetailModal({
  open,
  onClose,
  meta,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  meta: MetaDto | null;
  onUpdated: (meta: MetaDto) => void;
}) {
  const [avance, setAvance] = useState<string>('');
  const [estadoManual, setEstadoManual] = useState<string>('');
  const [showEvidenciaForm, setShowEvidenciaForm] = useState(false);
  const [evidenciaDescripcion, setEvidenciaDescripcion] = useState('');
  const [evidenciaUrl, setEvidenciaUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (meta) {
      setAvance(String(meta.avanceActual));
      setEstadoManual(meta.estado === 'NoIniciada' || meta.estado === 'EnProgreso' ? '' : meta.estado);
      setShowEvidenciaForm(false);
      setEvidenciaDescripcion('');
      setEvidenciaUrl('');
      setError(null);
    }
  }, [meta]);

  if (!meta) return null;

  async function handleActualizarAvance(e: React.FormEvent) {
    e.preventDefault();
    if (!meta) return;
    setBusy(true);
    setError(null);
    try {
      const valor = Number(avance);
      if (Number.isNaN(valor)) {
        throw new Error('El valor de avance debe ser numérico.');
      }
      const actualizada = await actualizarAvanceMeta(meta.id, {
        avanceActual: valor,
        estado: (estadoManual as EstadoMeta) || undefined,
      });
      onUpdated(actualizada);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el avance.');
    } finally {
      setBusy(false);
    }
  }

  async function handleAgregarEvidencia(e: React.FormEvent) {
    e.preventDefault();
    if (!meta) return;
    setBusy(true);
    setError(null);
    try {
      const actualizada = await agregarEvidencia(meta.id, {
        descripcion: evidenciaDescripcion,
        url: evidenciaUrl || undefined,
      });
      onUpdated(actualizada);
      setShowEvidenciaForm(false);
      setEvidenciaDescripcion('');
      setEvidenciaUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar la evidencia.');
    } finally {
      setBusy(false);
    }
  }

  async function handleCancelar() {
    if (!meta) return;
    if (!confirm('¿Estás seguro de cancelar esta meta? Esta acción no se puede deshacer.')) return;
    setBusy(true);
    setError(null);
    try {
      const actualizada = await cancelarMeta(meta.id);
      onUpdated(actualizada);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cancelar la meta.');
    } finally {
      setBusy(false);
    }
  }

  const puedeEditarAvance = meta.estado !== 'Cancelada' && meta.estado !== 'Cumplida';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={meta.nombre}
      subtitle={meta.indicadorNombre}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex justify-between items-center w-full">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleCancelar}
            disabled={busy || meta.estado === 'Cancelada'}
          >
            Cancelar meta
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900/60">
            {error}
          </div>
        )}

        {/* Resumen */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <SemaforoBadge semaforo={meta.semaforo} />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Estado: {estadoLabel(meta.estado)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>{meta.porcentajeCumplimiento}% de cumplimiento</span>
            <span>
              {meta.avanceActual} / {meta.valorEsperado} (inicial: {meta.valorInicial})
            </span>
          </div>
          <ProgressBar value={meta.porcentajeCumplimiento} semaforo={meta.semaforo} />
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Responsable: <strong className="text-slate-700 dark:text-slate-200">{meta.responsable}</strong></span>
            <span>Periodicidad: <strong className="text-slate-700 dark:text-slate-200">{meta.periodicidad}</strong></span>
            <span>Inicio: <strong className="text-slate-700 dark:text-slate-200">{meta.fechaInicio}</strong></span>
            <span>Límite: <strong className="text-slate-700 dark:text-slate-200">{meta.fechaLimite}</strong></span>
          </div>
          {meta.descripcion && (
            <p className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
              {meta.descripcion}
            </p>
          )}
        </div>

        {/* Actualizar avance */}
        {puedeEditarAvance && (
          <form onSubmit={handleActualizarAvance} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Actualizar avance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nuevo valor de avance" htmlFor="avance">
                <Input
                  id="avance"
                  type="number"
                  step="0.01"
                  required
                  value={avance}
                  onChange={(e) => setAvance(e.target.value)}
                />
              </Field>
              <Field label="Estado (opcional, se infiere si se deja vacío)" htmlFor="estadoManual">
                <Select
                  id="estadoManual"
                  value={estadoManual}
                  onChange={(e) => setEstadoManual(e.target.value)}
                >
                  <option value="">Inferir automáticamente</option>
                  {ESTADOS_MANUALES.map((estado) => (
                    <option key={estado} value={estado}>
                      {estadoLabel(estado)}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={busy}>
                {busy ? 'Guardando...' : 'Guardar avance'}
              </Button>
            </div>
          </form>
        )}

        {/* Evidencias */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Evidencias ({meta.evidencias.length})
            </h4>
            {!showEvidenciaForm && (
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowEvidenciaForm(true)}>
                <Plus className="w-3.5 h-3.5 text-[#67a623]" /> Agregar evidencia
              </Button>
            )}
          </div>

          {showEvidenciaForm && (
            <form
              onSubmit={handleAgregarEvidencia}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <Field label="Descripción" htmlFor="evidenciaDescripcion">
                <Textarea
                  id="evidenciaDescripcion"
                  rows={2}
                  required
                  maxLength={300}
                  value={evidenciaDescripcion}
                  onChange={(e) => setEvidenciaDescripcion(e.target.value)}
                />
              </Field>
              <Field label="URL (opcional)" htmlFor="evidenciaUrl">
                <Input
                  id="evidenciaUrl"
                  type="url"
                  value={evidenciaUrl}
                  onChange={(e) => setEvidenciaUrl(e.target.value)}
                  placeholder="https://..."
                />
              </Field>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowEvidenciaForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={busy}>
                  {busy ? 'Guardando...' : 'Guardar evidencia'}
                </Button>
              </div>
            </form>
          )}

          {meta.evidencias.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Aún no hay evidencias registradas para esta meta.</p>
          ) : (
            <ul className="space-y-2">
              {meta.evidencias.map((ev, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <FileText className="w-4 h-4 text-[#67a623] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-700 dark:text-slate-200">{ev.descripcion}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-400">{ev.fechaCarga}</span>
                      {ev.url && (
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#67a623] font-semibold hover:underline flex items-center gap-1"
                        >
                          <LinkIcon className="w-3 h-3" /> Ver enlace
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
