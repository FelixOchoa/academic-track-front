'use client';

import { GoalsManagementTab } from '@/components/tabs/goals-management-tab';

export default function GoalsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GoalsManagementTab />
      </div>
    </main>
  );
}
