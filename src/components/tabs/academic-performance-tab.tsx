'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/types/dashboardTypes';
import { Users, TrendingUp, AlertTriangle, CheckCircle, GraduationCap } from 'lucide-react';
import i18n from '@/i18n/es.json';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface TabProps {
  data: DashboardData;
  semesterFilter: string;
}

const compactTooltipStyle = {
  backgroundColor: '#152708',
  borderColor: '#67a623',
  borderRadius: '10px',
  fontSize: '11px',
  padding: '6px 10px',
  boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.4)'
};

const compactItemStyle = {
  fontSize: '11px',
  padding: '1px 0'
};

const compactLabelStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#afdd7a',
  marginBottom: '2px'
};

export function AcademicPerformanceTab({ data, semesterFilter }: TabProps) {
  const t = i18n.academicTab;
  const { students } = data;

  const filteredBreakdown = semesterFilter === 'Todos'
    ? students.semesterBreakdown
    : students.semesterBreakdown.filter(s => s.semestre === semesterFilter);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7ece28] via-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">{t.kpi.totalEnrolment}</span>
            <Users className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{students.totalEnrolled}</p>
          <p className="text-xs text-white/90 mt-1 flex items-center gap-1">
            <span className="font-bold bg-white/25 px-1.5 py-0.5 rounded text-[11px]">+{students.newStudents} {t.kpi.newStudents}</span> {t.kpi.inPeriod}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">{t.kpi.approvalRate}</span>
            <CheckCircle className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{students.approvalRate}</p>
          <p className="text-xs text-white/90 mt-1">
            {t.kpi.controlledReprobation} {students.reprobationRate}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#77be24] to-[#58921c] text-white shadow-md shadow-[#67a623]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">{t.kpi.dropoutRate}</span>
            <AlertTriangle className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{students.dropoutRate}</p>
          <p className="text-xs text-white/90 mt-1">
            {t.kpi.dropoutNote}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#80d429] via-[#67a623] to-[#4e8218] text-white shadow-md shadow-[#67a623]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">{t.kpi.graduationTime}</span>
            <GraduationCap className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{students.averageGraduationSemesters} Sem.</p>
          <p className="text-xs text-white/90 mt-1">
            {t.kpi.graduationMeta} {students.targetGraduationSemesters} semestres
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle>
              <TrendingUp className="w-5 h-5 text-[#67a623]" />
              {t.charts.enrolmentTitle}
            </CardTitle>
            <CardDescription>
              {t.charts.enrolmentDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={students.historicEnrolment} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMatriculados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#67a623" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#67a623" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8ecb4b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8ecb4b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={compactTooltipStyle}
                    itemStyle={compactItemStyle}
                    labelStyle={compactLabelStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="matriculados" name={t.charts.enrolmentTotalKey} stroke="#67a623" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMatriculados)" />
                  <Area type="monotone" dataKey="nuevos" name={t.charts.enrolmentNewKey} stroke="#8ecb4b" strokeWidth={2} fillOpacity={1} fill="url(#colorNuevos)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <CheckCircle className="w-5 h-5 text-[#67a623]" />
              {t.charts.semesterBreakdownTitle}
            </CardTitle>
            <CardDescription>
              {t.charts.semesterBreakdownDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="semestre" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    contentStyle={compactTooltipStyle}
                    itemStyle={compactItemStyle}
                    labelStyle={compactLabelStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="aprobacion" name={t.charts.approvalKey} fill="#67a623" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reprobacion" name={t.charts.reprobationKey} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="desercion" name={t.charts.dropoutKey} fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.table.title}</CardTitle>
          <CardDescription>
            {t.table.desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40">
                  <th className="py-3 px-4 rounded-l-xl">{t.table.colLevel}</th>
                  <th className="py-3 px-4">{t.table.colStudents}</th>
                  <th className="py-3 px-4">{t.table.colApproval}</th>
                  <th className="py-3 px-4">{t.table.colReprobation}</th>
                  <th className="py-3 px-4">{t.table.colDropout}</th>
                  <th className="py-3 px-4 rounded-r-xl">{t.table.colStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredBreakdown.map((item, idx) => {
                  let alertBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a]">
                      {t.table.statusHighRetention}
                    </span>
                  );
                  if (item.desercion > 15) {
                    alertBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        <AlertTriangle className="w-3 h-3" /> {t.table.statusEarlyAlert}
                      </span>
                    );
                  } else if (item.desercion > 10) {
                    alertBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {t.table.statusMediumAttention}
                      </span>
                    );
                  }

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {item.semestre}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {item.estudiantes} alumnos
                      </td>
                      <td className="py-3.5 px-4 text-[#67a623] dark:text-[#afdd7a] font-semibold">
                        {item.aprobacion}%
                      </td>
                      <td className="py-3.5 px-4 text-amber-600 dark:text-amber-400 font-medium">
                        {item.reprobacion}%
                      </td>
                      <td className="py-3.5 px-4 text-rose-600 dark:text-rose-400 font-semibold">
                        {item.desercion}%
                      </td>
                      <td className="py-3.5 px-4">
                        {alertBadge}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
