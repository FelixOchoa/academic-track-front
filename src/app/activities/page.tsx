'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ClipboardList, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  Activity,
  ActivityType,
  CreateActivityDto,
  UpdateActivityDto,
  AddEvidenceDto,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  addEvidence,
} from '@/api/activities';
import { Program, getPrograms } from '@/api/programs';
import { ApiError } from '@/api/http';
import { ActivitiesFilterBar } from '@/components/activities/activities-filter-bar';
import { ActivityCard } from '@/components/activities/activity-card';
import { ActivityFormModal } from '@/components/activities/activity-form-modal';
import { EvidenceFormModal } from '@/components/activities/evidence-form-modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type ModalState =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; activity: Activity }
  | { kind: 'evidence'; activity: Activity }
  | { kind: 'delete'; activity: Activity };

export default function ActivitiesPage() {
  const [programs, setPrograms] = useState<Program[]>([]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [programIdFilter, setProgramIdFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [modal, setModal] = useState<ModalState>({ kind: 'none' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getPrograms().then(setPrograms);
  }, []);

  const loadActivities = useCallback(() => {
    setLoading(true);
    setError(null);
    getActivities({
      programId: programIdFilter ? Number(programIdFilter) : undefined,
      type: typeFilter ? (Number(typeFilter) as ActivityType) : undefined,
    })
      .then(setActivities)
      .catch((err: unknown) => {
        const message = err instanceof ApiError ? err.message : 'No se pudieron cargar las actividades.';
        setError(message);
        setActivities([]);
      })
      .finally(() => setLoading(false));
  }, [programIdFilter, typeFilter]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleCreate = async (dto: CreateActivityDto | UpdateActivityDto) => {
    await createActivity(dto as CreateActivityDto);
    setModal({ kind: 'none' });
    loadActivities();
  };

  const handleEdit = async (dto: CreateActivityDto | UpdateActivityDto) => {
    if (modal.kind !== 'edit') return;
    await updateActivity(modal.activity.id, dto as UpdateActivityDto);
    setModal({ kind: 'none' });
    loadActivities();
  };

  const handleAddEvidence = async (dto: AddEvidenceDto) => {
    if (modal.kind !== 'evidence') return;
    await addEvidence(modal.activity.id, dto);
    setModal({ kind: 'none' });
    loadActivities();
  };

  const handleDelete = async () => {
    if (modal.kind !== 'delete') return;
    setDeleting(true);
    try {
      await deleteActivity(modal.activity.id);
      setModal({ kind: 'none' });
      loadActivities();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar la actividad.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 sm:p-3 bg-gradient-to-tr from-[#67a623] to-[#548a1a] rounded-xl sm:rounded-2xl text-white shadow-md shadow-[#67a623]/20 shrink-0">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                Registro de Actividades y Evidencias
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                Proyectos, hackathons, artículos y su soporte documental
              </p>
            </div>
          </div>

          <button
            onClick={loadActivities}
            className="p-2 sm:p-2.5 text-slate-600 dark:text-slate-300 hover:text-[#67a623] hover:bg-[#f4faec] dark:hover:bg-[#152708] rounded-xl transition-all shrink-0"
            title="Recargar actividades"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ActivitiesFilterBar
          programs={programs}
          programId={programIdFilter}
          type={typeFilter}
          onProgramIdChange={setProgramIdFilter}
          onTypeChange={setTypeFilter}
          onNewActivity={() => setModal({ kind: 'create' })}
        />

        {error && (
          <div className="mb-6 flex items-start gap-2 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-sm font-medium text-slate-400">Cargando actividades...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20 text-sm font-medium text-slate-400">
            No hay actividades registradas con los filtros actuales.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={() => setModal({ kind: 'edit', activity })}
                onDelete={() => setModal({ kind: 'delete', activity })}
                onAddEvidence={() => setModal({ kind: 'evidence', activity })}
              />
            ))}
          </div>
        )}
      </main>

      {modal.kind === 'create' && (
        <ActivityFormModal
          mode="create"
          programs={programs}
          onClose={() => setModal({ kind: 'none' })}
          onSubmit={handleCreate}
        />
      )}

      {modal.kind === 'edit' && (
        <ActivityFormModal
          mode="edit"
          activity={modal.activity}
          programs={programs}
          onClose={() => setModal({ kind: 'none' })}
          onSubmit={handleEdit}
        />
      )}

      {modal.kind === 'evidence' && (
        <EvidenceFormModal
          activityName={modal.activity.name}
          onClose={() => setModal({ kind: 'none' })}
          onSubmit={handleAddEvidence}
        />
      )}

      {modal.kind === 'delete' && (
        <ConfirmDialog
          title="Eliminar Actividad"
          description={`¿Seguro que deseas eliminar "${modal.activity.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          loading={deleting}
          onConfirm={handleDelete}
          onClose={() => setModal({ kind: 'none' })}
        />
      )}
    </div>
  );
}
