import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ActivityType, ACTIVITY_TYPE_LABELS } from '@/api/activities';

const TYPE_VARIANT: Record<ActivityType, 'success' | 'info' | 'purple' | 'warning'> = {
  [ActivityType.ClassroomProject]: 'info',
  [ActivityType.ResearchProject]: 'purple',
  [ActivityType.ScientificArticle]: 'success',
  [ActivityType.Hackathon]: 'warning',
};

export function ActivityTypeBadge({ type }: { type: ActivityType }) {
  return <Badge variant={TYPE_VARIANT[type]}>{ACTIVITY_TYPE_LABELS[type]}</Badge>;
}
