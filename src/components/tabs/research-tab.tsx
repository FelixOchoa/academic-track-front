'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/data/dashboardMockData';
import { Microscope, FileText, Lightbulb, Shield } from 'lucide-react';
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

export function ResearchTab({ data }: TabProps) {
  const { investigacion } = data;

  return (
    <div className="space-y-6">
      
      {/* Top Metric Highlights con la línea visual verde (Emerald / Teal) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Grupos MinCiencias</span>
            <Microscope className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{investigacion.grupos.length}</p>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            GISICO (Cat. A), AITICE (Cat. B)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Publicaciones</span>
            <FileText className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{investigacion.publicacionesRecientes}</p>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            {investigacion.scopusIndexed} en Scopus / WoS
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Innovaciones</span>
            <Lightbulb className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{investigacion.innovaciones}</p>
          <p className="text-xs text-emerald-100 mt-1">Prototipos industriales y software</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Patentes Registradas</span>
            <Shield className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{investigacion.patentes}</p>
          <p className="text-xs text-emerald-100 font-medium mt-1">Protección de propiedad intelectual</p>
        </div>

      </div>

      {/* Grupos de Investigación */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Microscope className="w-5 h-5 text-emerald-600" />
            Grupos de Investigación Reconocidos por MinCiencias
          </CardTitle>
          <CardDescription>
            Categorización institucional y producción científica asociada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investigacion.grupos.map((grupo, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-base">{grupo.nombre}</span>
                  <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                    Categoría {grupo.categoria}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Líder: <strong className="text-slate-700 dark:text-slate-200">{grupo.lider}</strong>
                </p>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">Líneas de Investigación:</p>
                  <div className="flex flex-wrap gap-1">
                    {grupo.lineasInvestigacion.map((linea, lIdx) => (
                      <span key={lIdx} className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[11px]">
                        {linea}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs text-slate-500">
                  <span>{grupo.semillerosActivos} Semilleros Activos</span>
                  <span className="font-medium text-emerald-600">Vigente 2025</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Historico de Publicaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Producción Científica (Artículos e Indexed Scopus)</CardTitle>
          <CardDescription>
            Evolución anual de artículos publicados en revistas indexadas internacionales y nacionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investigacion.historicoPublicaciones} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="año" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={compactTooltipStyle}
                  itemStyle={compactItemStyle}
                  labelStyle={compactLabelStyle}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="scopus" name="Indexadas Scopus / WoS (Q1-Q4)" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nacionales" name="Revistas Nacionales Publindex" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="libros" name="Libros / Capítulos de Libro" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Publicaciones Destacadas */}
      {investigacion.listaPublicaciones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Publicaciones Recientes de Impacto</CardTitle>
            <CardDescription>Artículos científicos indexados en Scopus / Web of Science</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {investigacion.listaPublicaciones.map((pub, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{pub.titulo}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Revista: <span className="font-semibold text-slate-700 dark:text-slate-300">{pub.revista}</span> ({pub.año})
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">DOI: {pub.doi}</p>
                  </div>
                  <span className="shrink-0 px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Indexada Scopus
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
