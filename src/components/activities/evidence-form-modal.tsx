'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { AddEvidenceDto } from '@/api/activities';

interface EvidenceFormModalProps {
  activityName: string;
  onClose: () => void;
  onSubmit: (dto: AddEvidenceDto) => Promise<void>;
}

export function EvidenceFormModal({ activityName, onClose, onSubmit }: EvidenceFormModalProps) {
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar la evidencia.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Agregar Evidencia"
      description={`Actividad: ${activityName}`}
      onClose={onClose}
      maxWidth="max-w-lg"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" form="evidence-form" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Agregar Evidencia'}
          </Button>
        </>
      }
    >
      <form id="evidence-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="URL de la evidencia" required hint="Por ahora solo se admite un enlace (ej. Drive, Sharepoint)">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            required
          />
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
