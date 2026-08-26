import { http } from './http';

export enum ActivityType {
  ClassroomProject = 1,
  ResearchProject = 2,
  ScientificArticle = 3,
  Hackathon = 4,
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  [ActivityType.ClassroomProject]: 'Proyecto de Aula',
  [ActivityType.ResearchProject]: 'Proyecto de Investigación',
  [ActivityType.ScientificArticle]: 'Artículo Científico',
  [ActivityType.Hackathon]: 'Hackathon',
};

export const ACTIVITY_TYPE_OPTIONS = Object.values(ActivityType)
  .filter((value): value is ActivityType => typeof value === 'number')
  .map((value) => ({ value, label: ACTIVITY_TYPE_LABELS[value] }));

export interface Evidence {
  id?: number;
  url: string;
}

export interface Activity {
  id: number;
  programId: number;
  type: ActivityType;
  name: string;
  date: string;
  location: string;
  responsible: string;
  participatingProfessors: string[];
  participatingStudents: string[];
  description: string;
  evidences: Evidence[];
}

export interface CreateActivityDto {
  programId: number;
  type: ActivityType;
  name: string;
  date: string;
  location: string;
  responsible: string;
  participatingProfessors: string[];
  participatingStudents: string[];
  description: string;
}

export interface UpdateActivityDto {
  name: string;
  date: string;
  location: string;
  responsible: string;
  participatingProfessors: string[];
  participatingStudents: string[];
  description: string;
}

export interface AddEvidenceDto {
  url: string;
}

export interface ActivitiesFilters {
  programId?: number;
  type?: ActivityType;
}

export function getActivities(filters?: ActivitiesFilters): Promise<Activity[]> {
  return http.get<Activity[]>('/activities', {
    programId: filters?.programId,
    type: filters?.type,
  });
}

export function getActivityById(id: number): Promise<Activity> {
  return http.get<Activity>(`/activities/${id}`);
}

export function createActivity(dto: CreateActivityDto): Promise<Activity> {
  return http.post<Activity>('/activities', dto);
}

export function updateActivity(id: number, dto: UpdateActivityDto): Promise<Activity> {
  return http.put<Activity>(`/activities/${id}`, dto);
}

export function deleteActivity(id: number): Promise<void> {
  return http.delete<void>(`/activities/${id}`);
}

export function addEvidence(activityId: number, dto: AddEvidenceDto): Promise<Activity> {
  return http.post<Activity>(`/activities/${activityId}/evidences`, dto);
}
