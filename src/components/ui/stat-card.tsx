import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'default' | 'success' | 'warning' | 'info' | 'purple';
  };
  accentColor?: 'blue' | 'emerald' | 'amber' | 'violet' | 'indigo' | 'rose';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
    border: 'border-blue-100 dark:border-blue-900/40'
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
    border: 'border-emerald-100 dark:border-emerald-900/40'
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    iconBg: 'bg-amber-600 text-white shadow-amber-500/20',
    border: 'border-amber-100 dark:border-amber-900/40'
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    iconBg: 'bg-violet-600 text-white shadow-violet-500/20',
    border: 'border-violet-100 dark:border-violet-900/40'
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    iconBg: 'bg-indigo-600 text-white shadow-indigo-500/20',
    border: 'border-indigo-100 dark:border-indigo-900/40'
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    iconBg: 'bg-rose-600 text-white shadow-rose-500/20',
    border: 'border-rose-100 dark:border-rose-900/40'
  }
};

const badgeVariantMap = {
  default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
};

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  badge,
  accentColor = 'blue'
}: StatCardProps) {
  const styles = colorMap[accentColor];

  return (
    <div className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900 border ${styles.border} shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
            {badge && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeVariantMap[badge.variant]}`}>
                {badge.text}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${styles.iconBg} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5 font-medium">
              <span className={trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {trend.label || "vs. período anterior"}
              </span>
            </div>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
