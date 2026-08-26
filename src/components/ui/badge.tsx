import React from 'react';
import { cn } from '@/components/ui/card';

type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'purple';

const badgeVariantMap: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  success:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  warning:
    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  purple:
    'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full whitespace-nowrap',
        badgeVariantMap[variant],
        className
      )}
      {...props}
    />
  );
}
