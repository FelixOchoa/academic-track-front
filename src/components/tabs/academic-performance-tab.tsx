'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/types/dashboardTypes';
import { Users, TrendingUp, AlertTriangle, CheckCircle, GraduationCap, Database, UploadCloud, Info, UserCheck, UserMinus } from 'lucide-react';
import i18n from '@/i18n/es.json';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface TabProps {
  data: DashboardData;
  periodFilter?: string;
  semesterFilter?: string;
}

const compactTooltipStyle = {
  backgroundColor: '#152708',
  borderColor: '#67a623',
  borderRadius: '12px',
  fontSize: '11px',
  padding: '8px 12px',
  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.4)',
  zIndex: 50
};

const compactItemStyle = {
  fontSize: '11px',
  padding: '2px 0'
};

const compactLabelStyle = {
  fontSize: '12px',
  fontWeight: 800,
  color: '#afdd7a',
  marginBottom: '4px'
};

export function AcademicPerformanceTab({ data, periodFilter, semesterFilter }: TabProps) {
  const t = i18n.academicTab;
  const { students } = data;

  const historicData = students.historicEnrolment || [];
  const historicEnrolmentReverse = [...historicData].reverse();

  // Selected period from FilterBar (defaults to latest available period in dataset)
  const targetPeriod = periodFilter || (historicData.length > 0 ? historicData[historicData.length - 1].period : '');

  // Find exact SACES enrolment record matching selected period
  const currentPeriodEnrolment = historicData.find(
    e => e.period.toLowerCase() === targetPeriod.toLowerCase()
  ) || (historicData.length > 0 ? historicData[historicData.length - 1] : null);

  const totalMatriculados = currentPeriodEnrolment?.matriculados ?? students.totalEnrolled;
  const totalNuevos = currentPeriodEnrolment?.nuevos ?? students.newStudents;
  const totalInscritos = currentPeriodEnrolment?.inscritos ?? 0;
  const totalAdmitidos = currentPeriodEnrolment?.admitidos ?? 0;
  const totalGraduados = currentPeriodEnrolment?.graduados ?? 0;
  const totalRetirados = currentPeriodEnrolment?.retirados ?? 0;
  const tasaDesercionFormatted = currentPeriodEnrolment ? `${currentPeriodEnrolment.tasaDesercion}%` : students.dropoutRate;

  const hasData = students.totalEnrolled > 0 || historicData.length > 0;

  return (
    <div className="space-y-6">
      
      {!hasData && (
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#f4faec] dark:bg-[#152708] text-[#67a623] dark:text-[#afdd7a] flex items-center justify-center">
            <Database className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sin datos de Rendimiento Académico cargados
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Para visualizar métricas, gráficos e informes de este módulo, suba el archivo de indicador oficial en la sección de carga.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#67a623] hover:bg-[#548a1a] text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Cargar Indicador de Rendimiento
          </Link>
        </div>
      )}

      {/* Dynamic KPI Cards responding to selected Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7ece28] via-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1">
              {t.kpi.totalEnrolment}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Users className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{totalMatriculados}</p>
          <p className="text-xs text-white/90 mt-1 flex items-center gap-1">
            <span className="font-bold bg-white/25 px-1.5 py-0.5 rounded text-[11px]">+{totalNuevos} {t.kpi.newStudents}</span> en {currentPeriodEnrolment?.period || targetPeriod}
          </p>

          <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Origen del Dato ({currentPeriodEnrolment?.period || targetPeriod}):</p>
            Estudiantes matriculados activos en el periodo {currentPeriodEnrolment?.period || targetPeriod} según el reporte Cuadro SACES.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1">
              Aspirantes & Selección
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <UserCheck className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{totalInscritos}</p>
          <p className="text-xs text-white/90 mt-1">
            Admitidos: <span className="font-bold bg-white/25 px-1.5 py-0.5 rounded text-[11px]">{totalAdmitidos} aspirantes</span>
          </p>

          <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Indicador de Selección ({currentPeriodEnrolment?.period || targetPeriod}):</p>
            Aspirantes inscritos vs. admitidos para el periodo {currentPeriodEnrolment?.period || targetPeriod}.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#77be24] to-[#58921c] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1">
              Deserción SPADIES
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <AlertTriangle className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{tasaDesercionFormatted}</p>
          <p className="text-xs text-white/90 mt-1">
            Retirados del periodo: <strong>{totalRetirados} estudiantes</strong>
          </p>

          <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Tasa Deserción SPADIES ({currentPeriodEnrolment?.period || targetPeriod}):</p>
            Porcentaje de desvinculación y alumnos retirados en {currentPeriodEnrolment?.period || targetPeriod}.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#80d429] via-[#67a623] to-[#4e8218] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1">
              Egresos & Titulación
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <GraduationCap className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold mt-2">{totalGraduados}</p>
          <p className="text-xs text-white/90 mt-1">
            Graduados en {currentPeriodEnrolment?.period || targetPeriod} (Promedio: {students.averageGraduationSemesters} sem.)
          </p>

          <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Graduados ({currentPeriodEnrolment?.period || targetPeriod}):</p>
            Alumnos graduados oficialmente en {currentPeriodEnrolment?.period || targetPeriod}.
          </div>
        </div>

      </div>

      {hasData && (
        <>
          {/* Charts Row 1: Historic Enrolment & Admission Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <Card className="overflow-visible relative">
              <CardHeader className="overflow-visible relative">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <TrendingUp className="w-5 h-5 text-[#67a623]" />
                    Evolución de Matrícula Total vs. Primíparos
                  </CardTitle>
                  <div className="group relative cursor-help">
                    <Info className="w-4.5 h-4.5 text-slate-400 hover:text-[#67a623] transition-colors" />
                    <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-72 p-3.5 bg-slate-900 text-slate-100 text-[11px] rounded-2xl shadow-2xl z-50 border border-slate-700 leading-relaxed">
                      <p className="font-bold text-[#afdd7a] mb-1">Análisis de Crecimiento de Matrícula:</p>
                      Muestra la tendencia histórica de matrícula total (área verde) vs. primíparos de primer semestre (área clara) desde 2018-1 hasta 2025-1 (Excel 2. Cuadro SACES).
                    </div>
                  </div>
                </div>
                <CardDescription>
                  Tendencia histórica de matriculados totales y estudiantes primíparos por semestre (2018-1 a 2025-1)
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-visible">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        allowEscapeViewBox={{ x: true, y: true }}
                        contentStyle={compactTooltipStyle}
                        itemStyle={compactItemStyle}
                        labelStyle={compactLabelStyle}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Area type="monotone" dataKey="matriculados" name="Matriculados Totales" stroke="#67a623" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMatriculados)" />
                      <Area type="monotone" dataKey="nuevos" name="Primíparos / Nuevos" stroke="#8ecb4b" strokeWidth={2} fillOpacity={1} fill="url(#colorNuevos)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-visible relative">
              <CardHeader className="overflow-visible relative">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <UserCheck className="w-5 h-5 text-[#67a623]" />
                    Embudo de Admisión (Inscritos vs. Admitidos)
                  </CardTitle>
                  <div className="group relative cursor-help">
                    <Info className="w-4.5 h-4.5 text-slate-400 hover:text-[#67a623] transition-colors" />
                    <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-72 p-3.5 bg-slate-900 text-slate-100 text-[11px] rounded-2xl shadow-2xl z-50 border border-slate-700 leading-relaxed">
                      <p className="font-bold text-[#afdd7a] mb-1">Proceso de Selección:</p>
                      Compara la demanda total de aspirantes inscritos frente a los admitidos y los primíparos efectivamente matriculados.
                    </div>
                  </div>
                </div>
                <CardDescription>
                  Aspirantes inscritos vs. admitidos por periodo académico según reporte SACES
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-visible">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        allowEscapeViewBox={{ x: true, y: true }}
                        contentStyle={compactTooltipStyle}
                        itemStyle={compactItemStyle}
                        labelStyle={compactLabelStyle}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="inscritos" name="Inscritos" fill="#67a623" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="admitidos" name="Admitidos" fill="#548a1a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Chart Row 2: Graduates vs. Dropout Rate */}
          <Card className="overflow-visible relative">
            <CardHeader className="overflow-visible relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserMinus className="w-5 h-5 text-amber-500" />
                    Dinámica de Egresos vs. Retirados & Tasa de Deserción (%)
                  </CardTitle>
                  <CardDescription>
                    Relación entre graduados, estudiantes retirados por cohorte y la tasa porcentual de deserción SPADIES
                  </CardDescription>
                </div>
                <div className="group relative cursor-help">
                  <Info className="w-4.5 h-4.5 text-slate-400 hover:text-[#67a623] transition-colors" />
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-80 p-4 bg-slate-900 text-slate-100 text-xs rounded-2xl shadow-2xl z-50 border border-slate-700 leading-relaxed space-y-2">
                    <p className="font-bold text-[#afdd7a]">📉 Análisis de Egreso y Permanencia:</p>
                    <p>• <strong>Graduados (Barras Verdes):</strong> Estudiantes que culminan satisfactoriamente su plan de estudios.</p>
                    <p>• <strong>Retirados (Barras Rojas):</strong> Estudiantes desvinculados por cohorte.</p>
                    <p>• <strong>Tasa Deserción (Línea Ámbar %):</strong> Índice porcentual reportado en el SACES.</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-visible">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={historicData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'Alumnos', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#64748b' } }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} unit="%" label={{ value: '% Deserción', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: '#f59e0b' } }} />
                    <Tooltip
                      allowEscapeViewBox={{ x: true, y: true }}
                      contentStyle={compactTooltipStyle}
                      itemStyle={compactItemStyle}
                      labelStyle={compactLabelStyle}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar yAxisId="left" dataKey="graduados" name="Graduados" fill="#67a623" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="retirados" name="Retirados" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="tasaDesercion" name="Tasa Deserción (%)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* SACES Official Table */}
          <Card className="overflow-visible relative">
            <CardHeader className="overflow-visible relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tabla Oficial de Indicadores por Periodo (Reporte SACES)</CardTitle>
                  <CardDescription>
                    Información histórica consolidada extraída directamente del reporte Excel 2. Cuadro SACES (2018-1 a 2025-1)
                  </CardDescription>
                </div>
                <div className="group relative cursor-help">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[#67a623] dark:text-[#afdd7a] text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700">
                    <Info className="w-3.5 h-3.5 text-[#67a623]" /> Filtro Activo: {currentPeriodEnrolment?.period || targetPeriod}
                  </span>
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-80 p-4 bg-slate-900 text-slate-100 text-xs rounded-2xl shadow-2xl z-50 border border-slate-700 leading-relaxed space-y-2">
                    <p className="font-bold text-[#afdd7a]">📄 Columnas del Reporte Oficial Cuadro SACES:</p>
                    <p>• <strong>Año y Período:</strong> Semestre académico oficial.</p>
                    <p>• <strong>Inscritos:</strong> Columna <em>Estudiantes inscritos</em> del Excel.</p>
                    <p>• <strong>Admitidos:</strong> Columna <em>Admitidos</em> del Excel.</p>
                    <p>• <strong>Matriculados:</strong> Columna <em>Estudiantes matriculados</em> del Excel.</p>
                    <p>• <strong>Primíparos:</strong> Columna <em>Primíparos Primer Semestre</em> del Excel.</p>
                    <p>• <strong>Graduados:</strong> Columna <em>Graduados (2)</em> del Excel.</p>
                    <p>• <strong>Retirados:</strong> Columna <em>Retirados</em> del Excel.</p>
                    <p>• <strong>Tasa Deserción:</strong> Columna <em>(%) Tasa deserción</em> del Excel.</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-visible">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40">
                      <th className="py-3 px-4 rounded-l-xl">Año y Período</th>
                      <th className="py-3 px-4">Inscritos</th>
                      <th className="py-3 px-4">Admitidos</th>
                      <th className="py-3 px-4">Matriculados</th>
                      <th className="py-3 px-4">Primíparos</th>
                      <th className="py-3 px-4">Graduados</th>
                      <th className="py-3 px-4">Retirados</th>
                      <th className="py-3 px-4 rounded-r-xl">Tasa Deserción (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {historicEnrolmentReverse.map((item, idx) => {
                      const isSelectedRow = (currentPeriodEnrolment?.period || targetPeriod).toLowerCase() === item.period.toLowerCase();
                      const desercionVal = item.tasaDesercion ?? 0.7;
                      let alertBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a]">
                          {desercionVal}% (Retención Alta)
                        </span>
                      );
                      if (desercionVal > 5.0) {
                        alertBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            <AlertTriangle className="w-3 h-3" /> {desercionVal}% (Alerta)
                          </span>
                        );
                      } else if (desercionVal > 2.0) {
                        alertBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {desercionVal}% (Moderado)
                          </span>
                        );
                      }

                      return (
                        <tr 
                          key={idx} 
                          className={`transition-colors ${
                            isSelectedRow 
                              ? 'bg-[#f4faec] dark:bg-[#152708]/80 font-semibold border-l-4 border-l-[#67a623]' 
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {item.period}
                            {isSelectedRow && (
                              <span className="text-[10px] bg-[#67a623] text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                                Filtro Activo
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                            {item.inscritos ?? 0}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                            {item.admitidos ?? 0}
                          </td>
                          <td className="py-3.5 px-4 text-[#67a623] dark:text-[#afdd7a] font-black">
                            {item.matriculados}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                            {item.nuevos}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                            {item.graduados ?? 0}
                          </td>
                          <td className="py-3.5 px-4 text-rose-600 dark:text-rose-400 font-medium">
                            {item.retirados ?? 0}
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
        </>
      )}

    </div>
  );
}
