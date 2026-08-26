'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/types/dashboardTypes';
import { UserCheck, Award, Briefcase, Database, UploadCloud, Info } from 'lucide-react';
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

const COLORS = ['#67a623', '#548a1a', '#8ecb4b', '#355516'];

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

export function FacultyTab({ data }: TabProps) {
  const t = i18n.facultyTab;
  const { faculty } = data;

  const hasData = faculty.total > 0 || faculty.educationLevel.length > 0;

  const phdCount = faculty.educationLevel.find(n => n.nivel === 'Doctorado')?.cantidad || 0;
  const masterCount = faculty.educationLevel.find(n => n.nivel === 'Maestría')?.cantidad || 0;
  const phdPercentage = faculty.total > 0 ? Math.round((phdCount / faculty.total) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {!hasData && (
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#f4faec] dark:bg-[#152708] text-[#67a623] dark:text-[#afdd7a] flex items-center justify-center">
            <Database className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sin datos de Cuerpo Docente cargados
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Para visualizar la distribución por nivel de formación y vinculación docente, cargue el archivo oficial en el módulo de ingesta.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#67a623] hover:bg-[#548a1a] text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Cargar Indicador de Docentes
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7ece28] via-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.totalFaculty}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <UserCheck className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{faculty.total}</p>
          <p className="text-xs text-white/90 mt-1">{faculty.fullTime} {t.kpi.fullTime}</p>

          <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Origen del Dato:</p>
            Total de profesores (Planta, Ocasionales y Cátedra) adscritos al programa según el reporte oficial de planta docente.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.phdFaculty}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Award className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{phdCount} ({phdPercentage}%)</p>
          <p className="text-xs text-white/90 font-medium mt-1">{t.kpi.cnaCompliance}</p>

          <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Indicador CNA:</p>
            Porcentaje de docentes con título de Doctorado: <code className="text-amber-300 bg-slate-800 px-1 rounded">(Docentes Ph.D. / Total Docentes) * 100</code>. El lineamiento CNA exige más del 20%.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#77be24] to-[#58921c] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.masterFaculty}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Briefcase className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{masterCount}</p>
          <p className="text-xs text-white/90 mt-1">{t.kpi.advancedDegree}</p>

          <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Cualificación Posgradual:</p>
            Número de profesores cuya máxima titulación acreditada es Maestría o Magíster.
          </div>
        </div>

      </div>

      {hasData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <Award className="w-5 h-5 text-[#67a623]" />
                    {t.charts.educationTitle}
                  </CardTitle>
                  <div className="group relative cursor-help">
                    <Info className="w-4.5 h-4.5 text-slate-400 hover:text-[#67a623] transition-colors" />
                    <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3.5 bg-slate-900 text-slate-100 text-[11px] rounded-2xl shadow-2xl z-50 border border-slate-700 leading-relaxed">
                      <p className="font-bold text-[#afdd7a] mb-1">Métricas de Formación:</p>
                      Muestra la proporción de docentes categorizados por su máximo título (Doctorado, Maestría, Especialización o Pregrado).
                    </div>
                  </div>
                </div>
                <CardDescription>
                  {t.charts.educationDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={faculty.educationLevel}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="cantidad"
                        nameKey="nivel"
                        label={({ nivel, porcentaje }) => `${nivel}: ${porcentaje}%`}
                        labelLine={false}
                      >
                        {faculty.educationLevel.map((entry, index) => (
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
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <Briefcase className="w-5 h-5 text-[#67a623]" />
                    {t.charts.hiringTitle}
                  </CardTitle>
                  <div className="group relative cursor-help">
                    <Info className="w-4.5 h-4.5 text-slate-400 hover:text-[#67a623] transition-colors" />
                    <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3.5 bg-slate-900 text-slate-100 text-[11px] rounded-2xl shadow-2xl z-50 border border-slate-700 leading-relaxed">
                      <p className="font-bold text-[#afdd7a] mb-1">Modalidad Contractual:</p>
                      Desglose de profesores de acuerdo con su dedicación (Tiempo Completo 40h, Medio Tiempo 20h o Cátedra por horas).
                    </div>
                  </div>
                </div>
                <CardDescription>
                  {t.charts.hiringDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={faculty.hiringDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="tipo" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        allowEscapeViewBox={{ x: true, y: true }}
                        contentStyle={compactTooltipStyle}
                        itemStyle={compactItemStyle}
                        labelStyle={compactLabelStyle}
                      />
                      <Bar dataKey="cantidad" name={t.charts.hiringQuantityKey} fill="#67a623" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.featured.title}</CardTitle>
              <CardDescription>
                {t.featured.desc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {faculty.featuredFaculty.map((doc) => (
                  <div key={doc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 p-3 rounded-xl transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a] font-bold flex items-center justify-center shrink-0">
                        {doc.nombre.split(' ').map(n => n[0]).slice(0,2).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{doc.nombre}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{doc.formacion}</p>
                        <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                          {t.featured.areaPrefix} {doc.areaConocimiento}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <p className="font-bold text-[#67a623] dark:text-[#afdd7a]">{doc.articulosPublicados} {t.featured.articlesSuffix}</p>
                        <p className="text-slate-400">{t.featured.publicationsLabel}</p>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a]">
                        {doc.vinculacion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

    </div>
  );
}
