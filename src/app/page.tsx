'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { FilterBar } from '@/components/filter-bar';
import { getDashboardData } from '@/data/dashboardMockData';

// Tab View Components
import { AcademicPerformanceTab } from '@/components/tabs/academic-performance-tab';
import { FacultyTab } from '@/components/tabs/faculty-tab';
import { ResearchTab } from '@/components/tabs/research-tab';
import { ExternalRelationsTab } from '@/components/tabs/external-relations-tab';
import { GraduatesTab } from '@/components/tabs/graduates-tab';

import {
  GraduationCap,
  Award,
  Microscope,
  Globe,
  Briefcase,
  Printer,
  X,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  // Estado de Filtros
  const [facultad] = useState('Facultad de Ingeniería y Tecnologías');
  const [programa, setPrograma] = useState('Ingeniería de Sistemas');
  const [periodo, setPeriodo] = useState('2025-1');
  const [semestre, setSemestre] = useState('Todos');

  // Estado de Pestañas
  const [activeTab, setActiveTab] = useState<'academico' | 'docentes' | 'investigacion' | 'relaciones' | 'egresados'>('academico');

  // Estado del Modal de Reporte
  const [showReportModal, setShowReportModal] = useState(false);

  // Obtención dinámica de datos mock
  const data = useMemo(() => {
    return getDashboardData(programa, periodo);
  }, [programa, periodo]);

  // Manejo de actualización manual
  const handleRefresh = () => {
    // Simular refresco
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      
      {/* Header / Navigation Bar */}
      <Navbar
        onExportReport={() => setShowReportModal(true)}
        onRefresh={handleRefresh}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Banner Informativo del Programa Seleccionado */}
        <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-emerald-900/40">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                  SNIES: {data.programaInfo.codigoSnies}
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-full">
                  {data.programaInfo.acreditacion}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                {data.programaInfo.nombre}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Director(a): <strong>{data.programaInfo.director}</strong></span>
                <span className="hidden sm:inline">•</span>
                <span>Modalidad {data.programaInfo.modalidad} ({data.programaInfo.duracionSemestres} Semestres)</span>
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center shrink-0">
              <div className="text-right hidden lg:block">
                <span className="text-[11px] uppercase font-bold text-slate-400">Estado CNA</span>
                <p className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Autoevaluación al Día
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Filter Control Bar */}
        <FilterBar
          facultad={facultad}
          programa={programa}
          periodo={periodo}
          semestre={semestre}
          onProgramaChange={setPrograma}
          onPeriodoChange={setPeriodo}
          onSemestreChange={setSemestre}
        />

        {/* Tabs Navigation Bar con estilo verde esmeralda */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          
          <button
            onClick={() => setActiveTab('academico')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'academico'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Rendimiento Académico & Estudiantes
          </button>

          <button
            onClick={() => setActiveTab('docentes')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'docentes'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Cuerpo Docente & Formación ({data.docentes.total})
          </button>

          <button
            onClick={() => setActiveTab('investigacion')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'investigacion'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Microscope className="w-4 h-4" />
            Investigación e Innovación ({data.investigacion.grupos.length} Grupos)
          </button>

          <button
            onClick={() => setActiveTab('relaciones')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'relaciones'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Relaciones Externas & Convenios ({data.relacionesExternas.conveniosNacionales + data.relacionesExternas.conveniosInternacionales})
          </button>

          <button
            onClick={() => setActiveTab('egresados')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'egresados'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Impacto de Egresados ({data.egresados.tasaVinculacionLaboral})
          </button>

        </div>

        {/* Tab Content Display */}
        <div className="transition-all duration-300">
          {activeTab === 'academico' && (
            <AcademicPerformanceTab data={data} semestreFiltro={semestre} />
          )}

          {activeTab === 'docentes' && (
            <FacultyTab data={data} />
          )}

          {activeTab === 'investigacion' && (
            <ResearchTab data={data} />
          )}

          {activeTab === 'relaciones' && (
            <ExternalRelationsTab data={data} />
          )}

          {activeTab === 'egresados' && (
            <GraduatesTab data={data} />
          )}

        </div>

      </main>

      {/* Modal de Informe de Autoevaluación CNA */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Resumen de Autoevaluación CNA
                  </h3>
                  <p className="text-xs text-slate-500">
                    {data.programaInfo.nombre} — Periodo {periodo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-wider">
                  1. Indicadores de Estudiantes y Permanencia
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Matrícula Total:</strong> {data.estudiantes.matriculadosActual} estudiantes ({data.estudiantes.nuevos} nuevos).</li>
                  <li>• <strong>Tasa de Aprobación:</strong> {data.estudiantes.tasaAprobacion}</li>
                  <li>• <strong>Tasa de Deserción:</strong> {data.estudiantes.tasaDesercionActual} (Estrategias de acompañamiento activas).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-wider">
                  2. Cuerpo Docente y Calidad Formativa
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Total Profesores:</strong> {data.docentes.total} ({data.docentes.tiempoCompleto} Tiempo Completo).</li>
                  <li>• <strong>Porcentaje con Doctorado (Ph.D.):</strong> {data.docentes.nivelFormacion.find(n => n.nivel === 'Doctorado')?.porcentaje}%</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-wider">
                  3. Investigación, Convenios y Egresados
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Grupos MinCiencias:</strong> {data.investigacion.grupos.map(g => `${g.nombre} (${g.categoria})`).join(', ')}.</li>
                  <li>• <strong>Publicaciones Scopus:</strong> {data.investigacion.scopusIndexed} artículos indexados.</li>
                  <li>• <strong>Convenios Activos:</strong> {data.relacionesExternas.conveniosNacionales} Nacionales / {data.relacionesExternas.conveniosInternacionales} Internacionales.</li>
                  <li>• <strong>Vinculación Laboral Egresados:</strong> {data.egresados.tasaVinculacionLaboral} empleabilidad.</li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                Imprimir / Guardar PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
