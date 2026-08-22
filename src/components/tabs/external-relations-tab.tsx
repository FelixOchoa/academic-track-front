'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/data/dashboardMockData';
import { Globe, Building, Users, Calendar, CheckCircle2 } from 'lucide-react';

interface TabProps {
  data: DashboardData;
}

export function ExternalRelationsTab({ data }: TabProps) {
  const { relacionesExternas } = data;

  return (
    <div className="space-y-6">
      
      {/* Top Cards Verde (Emerald / Teal) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Convenios Nacionales</span>
            <Building className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{relacionesExternas.conveniosNacionales}</p>
          <p className="text-xs text-emerald-100 mt-1">Empresas e Instituciones Públicas</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Convenios Internacionales</span>
            <Globe className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{relacionesExternas.conveniosInternacionales}</p>
          <p className="text-xs text-emerald-100 font-medium mt-1">Movilidad e investigación conjunta</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Actividades de Extensión</span>
            <Users className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{relacionesExternas.actividadesExtension.length}</p>
          <p className="text-xs text-emerald-100 mt-1">Proyección social regional</p>
        </div>

      </div>

      {/* Actividades de Extensión y Proyección Social */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Users className="w-5 h-5 text-emerald-600" />
            Actividades de Extensión y Proyección Social Registradas
          </CardTitle>
          <CardDescription>
            Proyectos con impacto territorial en el Cesar y región Caribe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relacionesExternas.actividadesExtension.map((act) => (
              <div key={act.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {act.tipo}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {act.fecha}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                  {act.nombre}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Impacto: <strong className="text-slate-900 dark:text-white">{act.impacto}</strong>
                </p>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-500" /> {act.participantes} Participantes
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded">
                    Completado
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Convenios Estratégicos */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Globe className="w-5 h-5 text-emerald-600" />
            Convenios y Alianzas Estratégicas Destacadas
          </CardTitle>
          <CardDescription>
            Acuerdos vigentes con universidades de prestigio y empresas del sector productivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/40">
                  <th className="py-3 px-4 rounded-l-xl">Institución / Empresa</th>
                  <th className="py-3 px-4">País</th>
                  <th className="py-3 px-4">Tipo de Convenio</th>
                  <th className="py-3 px-4 rounded-r-xl">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {relacionesExternas.conveniosLista.map((conv, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {conv.institucion}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {conv.pais}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                        {conv.tipo}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {conv.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
