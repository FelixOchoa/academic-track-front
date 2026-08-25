import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Semaforo } from '@/types/metas';

const config: Record<
  Semaforo,
  { tone: 'emerald' | 'amber' | 'rose' | 'slate'; label: string; Icon: React.ElementType }
> = {
  Verde: { tone: 'emerald', label: 'En meta', Icon: CheckCircle2 },
  Amarillo: { tone: 'amber', label: 'En riesgo', Icon: AlertTriangle },
  Rojo: { tone: 'rose', label: 'Retrasada', Icon: XCircle },
  Gris: { tone: 'slate', label: 'Cancelada', Icon: MinusCircle },
};

export function SemaforoBadge({ semaforo }: { semaforo: Semaforo | string }) {
  const { tone, label, Icon } = config[(semaforo as Semaforo)] ?? config.Gris;
  return (
    <Badge tone={tone}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Badge>
  );
}

const ESTADO_LABELS: Record<string, string> = {
  NoIniciada: 'No iniciada',
  EnProgreso: 'En progreso',
  Cumplida: 'Cumplida',
  Retrasada: 'Retrasada',
  Cancelada: 'Cancelada',
};

export function estadoLabel(estado: string): string {
  return ESTADO_LABELS[estado] ?? estado;
}
