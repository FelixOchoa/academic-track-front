'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/types/dashboardTypes';
import { Globe, Building, Users, Calendar, CheckCircle2, Database, UploadCloud, Info } from 'lucide-react';
import i18n from '@/i18n/es.json';

interface TabProps {
  data: DashboardData;
}

export function ExternalRelationsTab({ data }: TabProps) {
  const t = i18n.externalRelationsTab;
  const { externalRelations } = data;

  const hasData = externalRelations.nationalAgreements > 0 || externalRelations.internationalAgreements > 0 || externalRelations.extensionActivities.length > 0;

  return (
    <div className="space-y-6">
      
      {!hasData && (
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#f4faec] dark:bg-[#152708] text-[#67a623] dark:text-[#afdd7a] flex items-center justify-center">
            <Database className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sin datos de Proyección Social y Convenios cargados
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Para consultar alianzas institucionales, convenios y proyectos de extensión comunitaria, cargue el archivo correspondiente.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#67a623] hover:bg-[#548a1a] text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Cargar Indicador de Convenios
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7ece28] via-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.nationalAgreements}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Building className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{externalRelations.nationalAgreements}</p>
          <p className="text-xs text-white/90 mt-1">{t.kpi.nationalAgreementsNote}</p>

          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-xl z-20 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Convenios Colombia:</p>
            Alianzas estratégicas vigentes con entidades públicas, universidades y empresas nacionales para prácticas y proyectos.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.internationalAgreements}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Globe className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{externalRelations.internationalAgreements}</p>
          <p className="text-xs text-white/90 font-medium mt-1">{t.kpi.internationalAgreementsNote}</p>

          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-xl z-20 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Movilidad Internacional:</p>
            Convenios bilaterales activos con universidades extranjeras para intercambio de docentes, estudiantes e investigación conjunta.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#77be24] to-[#58921c] text-white shadow-md shadow-[#67a623]/20 relative group cursor-help">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              {t.kpi.extensionActivities}
              <Info className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </span>
            <Users className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{externalRelations.extensionActivities.length}</p>
          <p className="text-xs text-white/90 mt-1">{t.kpi.extensionNote}</p>

          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-slate-100 text-[11px] rounded-xl shadow-xl z-20 border border-slate-700 leading-snug">
            <p className="font-bold text-[#afdd7a] mb-1">Impacto Comunitario:</p>
            Proyectos de transferencia tecnológica, alfabetización digital y extensión aprobados por la vicerrectoría.
          </div>
        </div>

      </div>

      {hasData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                <Users className="w-5 h-5 text-[#67a623]" />
                {t.extensionSection.title}
              </CardTitle>
              <CardDescription>
                {t.extensionSection.desc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {externalRelations.extensionActivities.map((act) => (
                  <div key={act.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#67a623] dark:text-[#afdd7a]">
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
                      {t.extensionSection.impactPrefix} <strong className="text-slate-900 dark:text-white">{act.impacto}</strong>
                    </p>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#67a623]" /> {act.participantes} {t.extensionSection.participantsSuffix}
                      </span>
                      <span className="px-2 py-0.5 bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a] font-bold rounded">
                        {t.extensionSection.completedBadge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Globe className="w-5 h-5 text-[#67a623]" />
                {t.agreementsTable.title}
              </CardTitle>
              <CardDescription>
                {t.agreementsTable.desc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/40">
                      <th className="py-3 px-4 rounded-l-xl">{t.agreementsTable.colInstitution}</th>
                      <th className="py-3 px-4">{t.agreementsTable.colCountry}</th>
                      <th className="py-3 px-4">{t.agreementsTable.colType}</th>
                      <th className="py-3 px-4 rounded-r-xl">{t.agreementsTable.colStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {externalRelations.agreementsList.map((conv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          {conv.institucion}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {conv.pais}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#f4faec] text-[#406a16] dark:bg-[#152708] dark:text-[#afdd7a] border border-[#ceeaad]">
                            {conv.tipo}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#67a623] dark:text-[#afdd7a]">
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
        </>
      )}

    </div>
  );
}
