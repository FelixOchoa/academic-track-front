'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/data/dashboardMockData';
import { Users, TrendingUp, AlertTriangle, CheckCircle, GraduationCap } from 'lucide-react';
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
  semestreFiltro: string;
}

// Tooltip con fondo verde esmeralda oscuro (#022c22) conservando los colores propios de cada serie/indicador
const compactTooltipStyle = {
  backgroundColor: '#022c22',
  borderColor: '#059669',
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
  color: '#a7f3d0',
  marginBottom: '2px'
};

export function AcademicPerformanceTab({ data, semestreFiltro }: TabProps) {
  const { estudiantes } = data;

  const desgloseFiltrado = semestreFiltro === 'Todos'
    ? estudiantes.desgloseSemestre
    : estudiantes.desgloseSemestre.filter(s => s.semestre === semestreFiltro);

  return (
    <div className="space-y-6">
      
      {/* Sección 1: Tarjetas KPI con línea visual Verde (Emerald / Teal) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Matrícula Total</span>
            <Users className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{estudiantes.matriculadosActual}</p>
          <p className="text-xs text-emerald-100 mt-1 flex items-center gap-1">
            <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-[11px]">+{estudiantes.nuevos} nuevos</span> en este período
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Tasa de Aprobación</span>
            <CheckCircle className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{estudiantes.tasaAprobacion}</p>
          <p className="text-xs text-emerald-100 mt-1">
            Reprobación controlada: {estudiantes.tasaReprobacion}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Tasa de Deserción</span>
            <AlertTriangle className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{estudiantes.tasaDesercionActual}</p>
          <p className="text-xs text-emerald-100 mt-1">
            Concentrada en 1er y 2do semestre (Fundamentación)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Tiempo de Graduación</span>
            <GraduationCap className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{estudiantes.promedioGraduacionSemestres} Sem.</p>
          <p className="text-xs text-emerald-100 mt-1">
            Meta curricular: {estudiantes.metaGraduacionSemestres} semestres
          </p>
        </div>

      </div>

      {/* Sección 2: Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Evolución Histórica de Matrícula */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Evolución Histórica de Matrícula
            </CardTitle>
            <CardDescription>
              Comportamiento de estudiantes matriculados y nuevos por período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={estudiantes.historicoMatricula} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMatriculados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={compactTooltipStyle}
                    itemStyle={compactItemStyle}
                    labelStyle={compactLabelStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="matriculados" name="Total Matriculados" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMatriculados)" />
                  <Area type="monotone" dataKey="nuevos" name="Estudiantes Nuevos" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNuevos)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico 2: Indicadores por Bloque de Semestres */}
        <Card>
          <CardHeader>
            <CardTitle>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Indicadores por Bloque de Semestres
            </CardTitle>
            <CardDescription>
              Comparativa de Aprobación vs Reprobación vs Deserción por semestre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={desgloseFiltrado} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="semestre" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    contentStyle={compactTooltipStyle}
                    itemStyle={compactItemStyle}
                    labelStyle={compactLabelStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="aprobacion" name="% Aprobación" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reprobacion" name="% Reprobación" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="desercion" name="% Deserción" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Sección 3: Tabla Detallada por Semestre */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle por Nivel Curricular (Matrícula y Alertas Académicas)</CardTitle>
          <CardDescription>
            Desglose de población estudiantil e indicadores de permanencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40">
                  <th className="py-3 px-4 rounded-l-xl">Nivel Curricular</th>
                  <th className="py-3 px-4">Estudiantes</th>
                  <th className="py-3 px-4">% Aprobación</th>
                  <th className="py-3 px-4">% Reprobación</th>
                  <th className="py-3 px-4">% Deserción</th>
                  <th className="py-3 px-4 rounded-r-xl">Estado de Permanencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {desgloseFiltrado.map((item, idx) => {
                  let alertBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Normal / Retención Alta
                    </span>
                  );
                  if (item.desercion > 15) {
                    alertBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        <AlertTriangle className="w-3 h-3" /> Alerta Temprana
                      </span>
                    );
                  } else if (item.desercion > 10) {
                    alertBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Atención Media
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
                      <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
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
