'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/types/dashboardTypes';
import { Microscope, FileText, Lightbulb, Shield, Database, UploadCloud, Info } from 'lucide-react';
import i18n from '@/i18n/es.json';
import {
  ResponsiveContainer,
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
}

const compactTooltipStyle = {
  backgroundColor: '#152708',
  borderColor: '#67a623',
  borderRadius: '10px',
  fontSize: '11px',
  padding: '6px 10px',
  boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.4)',
  zIndex: 50
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

export function ResearchTab({ data }: TabProps) {
  const t = i18n.researchTab;
  const { research } = data;

  const hasData = research.groups.length > 0 || research.recentPublications > 0;

  return (
    <div className="space-y-6">
      
      {!hasData && (
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#f4faec] dark:bg-[#152708] text-[#67a623] dark:text-[#afdd7a] flex items-center justify-center">
            <Database className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sin datos de Investigación e Innovación cargados
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Para visualizar grupos MinCiencias, semilleros, publicaciones Scopus e innovaciones, cargue el archivo correspondiente.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#67a623] hover:bg-[#548a1a] text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Cargar Indicador de Investigación
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7ece28] via-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.groups}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Microscope className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{research.groups.length}</p>
          <p className="text-xs text-white/90 font-medium mt-1">
            {hasData ? 'GISICO (Cat. A), AITICE (Cat. B)' : 'Sin grupos registrados'}
          </p>

          <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Clasificación MinCiencias:</p>
            Número de colectivos de investigación institucionales avalados y categorizados en la convocatoria oficial de MinCiencias.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.publications}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <FileText className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{research.recentPublications}</p>
          <p className="text-xs text-white/90 font-medium mt-1">
            {research.scopusIndexed} {t.kpi.scopusIndexed}
          </p>

          <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Artículos Indexados:</p>
            Artículos científicos con afiliación institucional publicados en revistas científicas de impacto internacional (Scopus/WoS).
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#77be24] to-[#58921c] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.innovations}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Lightbulb className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{research.innovations}</p>
          <p className="text-xs text-white/90 mt-1">{t.kpi.innovationsNote}</p>

          <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Desarrollo Tecnológico:</p>
            Registros de software, prototipos industriales y productos tecnológicos desarrollados por docentes y semilleros.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#80d429] via-[#67a623] to-[#4e8218] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help overflow-visible">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.patents}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Shield className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{research.patents}</p>
          <p className="text-xs text-white/90 font-medium mt-1">{t.kpi.patentsNote}</p>

          <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-2xl z-50 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Propiedad Intelectual:</p>
            Patentes de invención o modelo de utilidad concedidas por la Superintendencia de Industria y Comercio (SIC).
          </div>
        </div>

      </div>

      {hasData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                <Microscope className="w-5 h-5 text-[#67a623]" />
                {t.groupsSection.title}
              </CardTitle>
              <CardDescription>
                {t.groupsSection.desc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {research.groups.map((grupo, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-base">{grupo.nombre}</span>
                      <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a] border border-[#ceeaad]">
                        {t.groupsSection.categoryPrefix} {grupo.categoria}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.groupsSection.leaderPrefix} <strong className="text-slate-700 dark:text-slate-200">{grupo.lider}</strong>
                    </p>
                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <p className="font-semibold text-[#67a623] dark:text-[#afdd7a]">{t.groupsSection.linesHeader}</p>
                      <div className="flex flex-wrap gap-1">
                        {grupo.lineasInvestigacion.map((linea, lIdx) => (
                          <span key={lIdx} className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[11px]">
                            {linea}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs text-slate-500">
                      <span>{grupo.semillerosActivos} {t.groupsSection.seedbedsSuffix}</span>
                      <span className="font-medium text-[#67a623]">{t.groupsSection.activeStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.charts.historyTitle}</CardTitle>
                <div className="group relative cursor-help">
                  <Info className="w-4.5 h-4.5 text-slate-400 hover:text-[#67a623] transition-colors" />
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 p-3.5 bg-slate-900 text-slate-100 text-[11px] rounded-2xl shadow-2xl z-50 border border-slate-700 leading-relaxed">
                    <p className="font-bold text-[#afdd7a] mb-1">Producción Científica:</p>
                    Conteo consolidado por año de artículos Scopus, publicaciones en revistas nacionales y libros de investigación editados.
                  </div>
                </div>
              </div>
              <CardDescription>
                {t.charts.historyDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={research.historicPublications} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="año" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      allowEscapeViewBox={{ x: true, y: true }}
                      contentStyle={compactTooltipStyle}
                      itemStyle={compactItemStyle}
                      labelStyle={compactLabelStyle}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="scopus" name={t.charts.scopusKey} fill="#67a623" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nacionales" name={t.charts.nationalKey} fill="#548a1a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="libros" name={t.charts.booksKey} fill="#8ecb4b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {research.featuredPublications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t.featured.title}</CardTitle>
                <CardDescription>{t.featured.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {research.featuredPublications.map((pub, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{pub.titulo}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {t.featured.journalPrefix} <span className="font-semibold text-slate-700 dark:text-slate-300">{pub.revista}</span> ({pub.año})
                        </p>
                        <p className="text-[11px] text-[#67a623] dark:text-[#afdd7a] mt-0.5">DOI: {pub.doi}</p>
                      </div>
                      <span className="shrink-0 px-3 py-1 text-xs font-bold rounded-full bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a]">
                        {t.featured.badgeText}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

    </div>
  );
}
