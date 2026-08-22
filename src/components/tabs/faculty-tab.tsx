'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/data/dashboardMockData';
import { UserCheck, Award, Briefcase } from 'lucide-react';
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

const COLORS = ['#10b981', '#059669', '#34d399', '#64748b'];

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

export function FacultyTab({ data }: TabProps) {
  const { docentes } = data;

  const phdCount = docentes.nivelFormacion.find(n => n.nivel === 'Doctorado')?.cantidad || 0;
  const masterCount = docentes.nivelFormacion.find(n => n.nivel === 'Maestría')?.cantidad || 0;
  const phdPercentage = Math.round((phdCount / docentes.total) * 100);

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Verde (Emerald / Teal) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Cuerpo Docente</span>
            <UserCheck className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{docentes.total}</p>
          <p className="text-xs text-emerald-100 mt-1">{docentes.tiempoCompleto} Planta / Tiempo Completo</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Docentes Ph.D. / Doctorado</span>
            <Award className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{phdCount} ({phdPercentage}%)</p>
          <p className="text-xs text-emerald-100 font-medium mt-1">Cumple indicador de acreditación CNA</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Docentes Maestría</span>
            <Briefcase className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{masterCount}</p>
          <p className="text-xs text-emerald-100 mt-1">Alto nivel de formación avanzada</p>
        </div>

      </div>

      {/* Gráficos de Formación y Vinculación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico Torta: Nivel de Formación */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Award className="w-5 h-5 text-emerald-600" />
              Nivel de Formación Académica
            </CardTitle>
            <CardDescription>
              Distribución por máximo grado académico alcanzado por los profesores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={docentes.nivelFormacion}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="cantidad"
                    nameKey="nivel"
                    label={({ nivel, porcentaje }) => `${nivel}: ${porcentaje}%`}
                  >
                    {docentes.nivelFormacion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={compactTooltipStyle}
                    itemStyle={compactItemStyle}
                    labelStyle={compactLabelStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico Barras: Tipo de Contratación */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Modalidad de Vinculación Docente
            </CardTitle>
            <CardDescription>
              Proporción de docentes de planta vs ocasionales y de cátedra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={docentes.distribucionContratacion} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="tipo" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={compactTooltipStyle}
                    itemStyle={compactItemStyle}
                    labelStyle={compactLabelStyle}
                  />
                  <Bar dataKey="cantidad" name="Cantidad de Docentes" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Lista de Profesores Destacados */}
      <Card>
        <CardHeader>
          <CardTitle>Cuerpo Docente Destacado e Investigación</CardTitle>
          <CardDescription>
            Profesores con publicaciones científicas y proyectos activos en la facultad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {docentes.docentesLista.map((doc) => (
              <div key={doc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 p-3 rounded-xl transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                    {doc.nombre.split(' ').map(n => n[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{doc.nombre}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{doc.formacion}</p>
                    <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                      Área: {doc.areaConocimiento}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{doc.articulosPublicados} Artículos</p>
                    <p className="text-slate-400">Publicaciones</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {doc.vinculacion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
