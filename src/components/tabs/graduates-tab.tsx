'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/types/dashboardTypes';
import { Briefcase, DollarSign, Clock, ThumbsUp, MapPin, Database, UploadCloud, Info } from 'lucide-react';
import i18n from '@/i18n/es.json';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface TabProps {
  data: DashboardData;
}

const COLORS = ['#67a623', '#548a1a', '#8ecb4b', '#406a16', '#64748b'];

const compactTooltipStyle = {
  backgroundColor: '#152708',
  borderColor: '#67a623',
  borderRadius: '10px',
  fontSize: '11px',
  padding: '6px 10px',
  boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.4)',
  color: '#ffffff',
  zIndex: 50
};

const compactItemStyle = {
  fontSize: '11px',
  padding: '1px 0',
  color: '#ffffff'
};

const compactLabelStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#afdd7a',
  marginBottom: '2px'
};

export function GraduatesTab({ data }: TabProps) {
  const t = i18n.graduatesTab;
  const { graduates } = data;

  const hasData = graduates.performanceSectors.length > 0 || graduates.locationDistribution.length > 0;

  return (
    <div className="space-y-6">

      {!hasData && (
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#f4faec] dark:bg-[#152708] text-[#67a623] dark:text-[#afdd7a] flex items-center justify-center">
            <Database className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sin datos de Impacto de Egresados cargados
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Para visualizar la empleabilidad, tiempo de enganche laboral y sectores de desempeño, cargue el reporte de egresados.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#67a623] hover:bg-[#548a1a] text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Cargar Indicador de Egresados
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7ece28] via-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.employmentRate}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Briefcase className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-black">{graduates.employmentRate}</p>
          <p className="text-xs text-white/90 mt-1">{t.kpi.employmentNote}</p>

          <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Medición de OLE (MinEducación):</p>
            Porcentaje de egresados que cotizan a la seguridad social o cuentan con contrato laboral formal antes del primer año de graduación.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.timeToEmployment}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Clock className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{graduates.timeToEmploymentMonths} meses</p>
          <p className="text-xs text-white/90 font-medium mt-1">{t.kpi.timeNote}</p>

          <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Tiempo de Enganche:</p>
            Promedio aritmético en meses transcurridos entre la fecha de expedición del acta de grado y la firma del primer contrato profesional.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#77be24] to-[#58921c] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.averageIncome}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <DollarSign className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{graduates.averageIncomeSMLV} SMLV</p>
          <p className="text-xs text-white/90 mt-1">{t.kpi.incomeNote}</p>

          <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Enganche Salarial:</p>
            Remuneración promedio del graduado expresada en múltiplos del Salario Mínimo Legal Mensual Vigente en Colombia.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#80d429] via-[#67a623] to-[#4e8218] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.employerSatisfaction}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <ThumbsUp className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{graduates.employerSatisfaction}</p>
          <p className="text-xs text-white/90 font-medium mt-1">{t.kpi.satisfactionNote}</p>

          <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Encuesta a Empleadores:</p>
            Puntaje ponderado de percepción de calidad y competencias técnicas según encuestas aplicadas a los jefes inmediatos.
          </div>
        </div>

      </div>

      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Card>
            <CardHeader>
              <CardTitle>
                <Briefcase className="w-5 h-5 text-[#67a623]" />
                {t.charts.sectorsTitle}
              </CardTitle>
              <CardDescription>
                {t.charts.sectorsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={graduates.performanceSectors}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="porcentaje"
                      nameKey="sector"
                      label={({ sector, porcentaje }) => `${sector}: ${porcentaje}%`}
                      labelLine={false}
                    >
                      {graduates.performanceSectors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      allowEscapeViewBox={{ x: true, y: true }}
                      contentStyle={compactTooltipStyle}
                      itemStyle={compactItemStyle}
                      labelStyle={compactLabelStyle}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <MapPin className="w-5 h-5 text-[#67a623]" />
                {t.charts.locationTitle}
              </CardTitle>
              <CardDescription>
                {t.charts.locationDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graduates.locationDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip
                      allowEscapeViewBox={{ x: true, y: true }}
                      contentStyle={compactTooltipStyle}
                      itemStyle={compactItemStyle}
                      labelStyle={compactLabelStyle}
                    />
                    <Bar dataKey="porcentaje" name={t.charts.graduatesPercentKey} fill="#67a623" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

    </div>
  );
}
