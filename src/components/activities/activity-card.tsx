import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityTypeBadge } from '@/components/activities/activity-type-badge';
import { Activity } from '@/api/activities';
import { CalendarDays, MapPin, User, Users, GraduationCap, Link as LinkIcon, Pencil, Trash2, FilePlus2 } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
  onAddEvidence: () => void;
}

export function ActivityCard({ activity, onEdit, onDelete, onAddEvidence }: ActivityCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <CardTitle className="flex-wrap">
            {activity.name}
            <ActivityTypeBadge type={activity.type} />
          </CardTitle>
          <CardDescription>Programa #{activity.programId}</CardDescription>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="ghost" onClick={onAddEvidence} title="Agregar evidencia" className="px-2.5 hover:text-[#67a623]">
            <FilePlus2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={onEdit} title="Editar actividad" className="px-2.5 hover:text-[#67a623]">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={onDelete} title="Eliminar actividad" className="px-2.5 hover:text-rose-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-[#67a623] shrink-0" />
            {activity.date?.slice(0, 10)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#67a623] shrink-0" />
            {activity.location}
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#67a623] shrink-0" />
            Responsable: {activity.responsible}
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300">{activity.description}</p>

        {(activity.participatingProfessors.length > 0 || activity.participatingStudents.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {activity.participatingProfessors.length > 0 && (
              <div className="flex items-start gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-[#67a623] shrink-0 mt-0.5" />
                <span className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-100">Profesores:</strong>{' '}
                  {activity.participatingProfessors.join(', ')}
                </span>
              </div>
            )}
            {activity.participatingStudents.length > 0 && (
              <div className="flex items-start gap-2">
                <Users className="w-3.5 h-3.5 text-[#67a623] shrink-0 mt-0.5" />
                <span className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-100">Estudiantes:</strong>{' '}
                  {activity.participatingStudents.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Evidencias ({activity.evidences?.length ?? 0})
          </p>

          {activity.evidences?.length > 0 ? (
            <div className="space-y-2">
              {activity.evidences.map((evidence, idx) => (
                <a
                  key={evidence.id ?? idx}
                  href={evidence.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs hover:border-[#67a623] dark:hover:border-[#67a623] transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-[#67a623] shrink-0" />
                  <span className="flex-1 min-w-0 truncate text-slate-700 dark:text-slate-200">
                    {evidence.url}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Sin evidencias registradas.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
