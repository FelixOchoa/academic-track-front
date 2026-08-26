import React from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'emerald' | 'amber' | 'rose' | 'slate';
type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'purple';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: BadgeVariant;
}

const toneClasses: Record<BadgeTone, string> = {
  emerald:
    'bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a] border border-[#ceeaad] dark:border-[#355516]',
  amber:
    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  rose:
    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  slate:
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const badgeVariantMap: Record<BadgeVariant, string> = {
  default:
    'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  success:
    'bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a] border border-[#ceeaad] dark:border-[#355516]',
  warning:
    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  info:
    'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  purple:
    'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
};

export function Badge({
  className,
  tone,
  variant,
  ...props
}: BadgeProps) {
  const badgeClass = variant
    ? badgeVariantMap[variant]
    : toneClasses[tone ?? 'slate'];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full',
        badgeClass,
        className
      )}
      {...props}
    />
  );
}
