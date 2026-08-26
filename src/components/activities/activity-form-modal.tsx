'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Activity,
  ACTIVITY_TYPE_OPTIONS,
  ActivityType,
  CreateActivityDto,
  UpdateActivityDto,
} from '@/api/activities';
import { Program } from '@/api/programs';

interface ActivityFormModalProps {
  mode: 'create' | 'edit';
  activity?: Activity;
  programs: Program[];
  onClose: () => void;
  onSubmit: (dto: CreateActivityDto | UpdateActivityDto) => Promise<void>;
}

function toNameList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function ActivityFormModal({
  mode,
  activity,
  programs,
  onClose,
  onSubmit,
}: ActivityFormModalProps) {
  const [programId, setProgramId] = useState<string>(activity ? String(activity.programId) : '');
  const [type, setType] = useState<ActivityType>(activity?.type ?? ActivityType.ClassroomProject);
  const [name, setName] = useState(activity?.name ?? '');
  const [date, setDate] = useState(activity?.date?.slice(0, 10) ?? '');
  const [location, setLocation] = useState(activity?.location ?? '');
  const [responsible, setResponsible] = useState(activity?.responsible ?? '');
  const [professors, setProfessors] = useState((activity?.participatingProfessors ?? []).join(', '));
  const [students, setStudents] = useState((activity?.participatingStudents ?? []).join(', '));
  const [description, setDescription] = useState(activity?.description ?? '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'create' && !programId) {
      setError('Debes indicar el programa (programId).');
      return;
    }

    const base = {
      name,
      date,
      location,
      responsible,
      participatingProfessors: toNameList(professors),
      participatingStudents: toNameList(students),
      description,
    };

    const dto: CreateActivityDto | UpdateActivityDto =
      mode === 'create' ? { ...base, programId: Number(programId), type } : base;

    setSubmitting(true);
    try {
      await onSubmit(dto);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la actividad.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={mode === 'create' ? 'Nueva Actividad' : `Editar Actividad — ${activity?.name}`}
      description="Registro de actividades del programa académico (proyectos, hackathons, artículos, etc.)"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" form="activity-form" disabled={submitting}>
            {submitting ? 'Guardando...' : mode === 'create' ? 'Crear Actividad' : 'Guardar Cambios'}
          </Button>
        </>
      }
    >
      <form id="activity-form" onSubmit={handleSubmit} className="space-y-4">
        {mode === 'create' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Programa (programId)" required>
              <Select value={programId} onChange={(e) => setProgramId(e.target.value)} required>
                <option value="">Selecciona un programa</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Tipo de actividad" required>
              <Select value={type} onChange={(e) => setType(Number(e.target.value) as ActivityType)} required>
                {ACTIVITY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        )}

        <Field label="Nombre de la actividad" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Fecha" required>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="Lugar" required>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
          </Field>
        </div>

        <Field label="Responsable" required>
          <Input value={responsible} onChange={(e) => setResponsible(e.target.value)} required />
        </Field>

        <Field label="Profesores participantes" hint="Separados por coma">
          <Input
            value={professors}
            onChange={(e) => setProfessors(e.target.value)}
            placeholder="Juan Pérez, María Gómez"
          />
        </Field>

        <Field label="Estudiantes participantes" hint="Separados por coma">
          <Input
            value={students}
            onChange={(e) => setStudents(e.target.value)}
            placeholder="Carlos Ruiz, Laura Torres"
          />
        </Field>

        <Field label="Descripción" required>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
        </Field>

        {error && (
          <p className="text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
