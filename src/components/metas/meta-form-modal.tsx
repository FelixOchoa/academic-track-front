'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/form-controls';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  actualizarMeta,
  crearMeta,
} from '@/services/metasService';
import { obtenerIndicadores } from '@/services/indicadoresService';
import { IndicadorDto, MetaDto, Periodicidad } from '@/types/metas';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (meta: MetaDto) => void;
  metaToEdit?: MetaDto | null;
  defaultProgramaId?: number;
}

const PERIODICIDADES: Periodicidad[] = [
  'Mensual',
  'Semestral',
  'Anual',
];

const emptyForm = {
  programaId: '',
  indicadorId: '',
  nombre: '',
  descripcion: '',
  responsable: '',
  periodicidad: 'Mensual' as Periodicidad,
  fechaInicio: '',
  fechaLimite: '',
  valorInicial: '',
  valorEsperado: '',
};

export function MetaFormModal({ open, onClose, onSaved, metaToEdit, defaultProgramaId }: Props) {
  const [indicadores, setIndicadores] = useState<IndicadorDto[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(metaToEdit);

  useEffect(() => {
    if (!open) return;
    obtenerIndicadores()
      .then(setIndicadores)
      .catch(() => setIndicadores([]));

    if (metaToEdit) {
      setForm({
        programaId: String(metaToEdit.programaId),
        indicadorId: '',
        nombre: metaToEdit.nombre,
        descripcion: metaToEdit.descripcion ?? '',
        responsable: metaToEdit.responsable,
        periodicidad: metaToEdit.periodicidad as Periodicidad,
        fechaInicio: metaToEdit.fechaInicio,
        fechaLimite: metaToEdit.fechaLimite,
        valorInicial: String(metaToEdit.valorInicial),
        valorEsperado: String(metaToEdit.valorEsperado),
      });
    } else {
      setForm({ ...emptyForm, programaId: String(defaultProgramaId) });
    }
    setError(null);
  }, [open, metaToEdit, defaultProgramaId]);

  function update<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.fechaLimite < form.fechaInicio) {
      setError('La fecha límite no puede ser anterior a la fecha de inicio.');
      return;
    }

    setSaving(true);
    try {
      let saved: MetaDto;
      if (isEdit && metaToEdit) {
        saved = await actualizarMeta(metaToEdit.id, {
          nombre: form.nombre,
          descripcion: form.descripcion || null,
          responsable: form.responsable,
          periodicidad: form.periodicidad,
          fechaInicio: form.fechaInicio,
          fechaLimite: form.fechaLimite,
          valorEsperado: Number(form.valorEsperado),
        });
      } else {
        saved = await crearMeta({
          programaId: Number(form.programaId),
          indicadorId: Number(form.indicadorId),
          nombre: form.nombre,
          descripcion: form.descripcion || null,
          responsable: form.responsable,
          periodicidad: form.periodicidad,
          fechaInicio: form.fechaInicio,
          fechaLimite: form.fechaLimite,
          valorInicial: Number(form.valorInicial),
          valorEsperado: Number(form.valorEsperado),
        });
      }
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la meta.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar meta' : 'Nueva meta'}
      subtitle={isEdit ? metaToEdit?.nombre : 'Registrar una meta de programa'}
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="meta-form" disabled={saving}>
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear meta'}
          </Button>
        </>
      }
    >
      <form id="meta-form" onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900/60">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Programa (ID)" htmlFor="programaId">
            <Input
              id="programaId"
              type="number"
              min={1}
              required
              disabled={isEdit}
              value={form.programaId}
              onChange={(e) => update('programaId', e.target.value)}
            />
          </Field>

          <Field label="Indicador" htmlFor="indicadorId">
            {isEdit ? (
              <Input value={metaToEdit?.indicadorNombre ?? ''} disabled />
            ) : (
              <Select
                id="indicadorId"
                required
                value={form.indicadorId}
                onChange={(e) => update('indicadorId', e.target.value)}
              >
                <option value="">Selecciona un indicador...</option>
                {indicadores.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.nombre} {ind.unidad ? `(${ind.unidad})` : ''}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <Field label="Nombre de la meta" htmlFor="nombre">
          <Input
            id="nombre"
            required
            maxLength={200}
            value={form.nombre}
            onChange={(e) => update('nombre', e.target.value)}
            placeholder="Ej: Reducir deserción en tercer semestre"
          />
        </Field>

        <Field label="Descripción (opcional)" htmlFor="descripcion">
          <Textarea
            id="descripcion"
            rows={3}
            value={form.descripcion}
            onChange={(e) => update('descripcion', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Responsable" htmlFor="responsable">
            <Input
              id="responsable"
              required
              maxLength={150}
              value={form.responsable}
              onChange={(e) => update('responsable', e.target.value)}
              placeholder="Ej: Coordinación de Ingeniería de Sistemas"
            />
          </Field>

          <Field label="Periodicidad" htmlFor="periodicidad">
            <Select
              id="periodicidad"
              required
              value={form.periodicidad}
              onChange={(e) => update('periodicidad', e.target.value)}
            >
              {PERIODICIDADES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Fecha de inicio" htmlFor="fechaInicio">
            <Input
              id="fechaInicio"
              type="date"
              required
              value={form.fechaInicio}
              onChange={(e) => update('fechaInicio', e.target.value)}
            />
          </Field>

          <Field label="Fecha límite" htmlFor="fechaLimite">
            <Input
              id="fechaLimite"
              type="date"
              required
              value={form.fechaLimite}
              onChange={(e) => update('fechaLimite', e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Valor inicial" htmlFor="valorInicial">
            <Input
              id="valorInicial"
              type="number"
              step="0.01"
              required
              disabled={isEdit}
              value={form.valorInicial}
              onChange={(e) => update('valorInicial', e.target.value)}
            />
          </Field>

          <Field label="Valor esperado" htmlFor="valorEsperado">
            <Input
              id="valorEsperado"
              type="number"
              step="0.01"
              required
              value={form.valorEsperado}
              onChange={(e) => update('valorEsperado', e.target.value)}
            />
          </Field>
        </div>
      </form>
    </Modal>
  );
}
