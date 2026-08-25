'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { FilterBar } from '@/components/filter-bar';
import { DashboardData } from '@/types/dashboardTypes';
import { fetchDashboardData } from '@/services/academicIndicatorsService';
import {
  studentAlumniService,
  Programa,
  Periodo,
} from '@/services/student-alumni.service';


import i18n from '@/i18n/es.json';

import { AcademicPerformanceTab } from '@/components/tabs/academic-performance-tab';
import { FacultyTab } from '@/components/tabs/faculty-tab';
import { ResearchTab } from '@/components/tabs/research-tab';
import { ExternalRelationsTab } from '@/components/tabs/external-relations-tab';
import { GraduatesTab } from '@/components/tabs/graduates-tab';
import { CohortAnalysisTab } from '@/components/tabs/cohort-analysis-tab';

import {
  Award,
  Microscope,
  Globe,
  Users,
  Briefcase,
  Printer,
  X,
  FileCheck,
  CheckCircle2,
  BookOpen,
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

type TabType =
  | 'academic'
  | 'cohort'
  | 'faculty'
  | 'research'
  | 'externalRelations'
  | 'graduates';

export default function DashboardPage() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [faculty] = useState('Facultad de Ingeniería y Tecnologías');
  const [program, setProgram] = useState('');
const [period, setPeriod] = useState('');
const [semester, setSemester] = useState('Todos');

const [programaId, setProgramaId] = useState<number | null>(null);
const [periodoCohorteId, setPeriodoCohorteId] = useState<number | null>(null);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('academic');
  const [isTabLoading, setIsTabLoading] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const [data, setData] = useState<DashboardData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);



const obtenerValorPeriodo = (periodo: Periodo): string => {
  return `${periodo.anio}-${periodo.semestre === 'I' ? '1' : '2'}`;
};

const obtenerUltimoAnioCompleto = (
  periodosData: Periodo[]
): number | null => {
  const anios = [...new Set(periodosData.map((periodo) => periodo.anio))]
    .sort((a, b) => b - a);

  const ultimoAnioCompleto = anios.find((anio) => {
    const tienePrimerSemestre = periodosData.some(
      (periodo) =>
        periodo.anio === anio &&
        periodo.semestre === 'I'
    );

    const tieneSegundoSemestre = periodosData.some(
      (periodo) =>
        periodo.anio === anio &&
        periodo.semestre === 'II'
    );

    return tienePrimerSemestre && tieneSegundoSemestre;
  });

  return ultimoAnioCompleto ?? null;
};

const obtenerPeriodoCohorteInicial = (
  periodosData: Periodo[]
): Periodo | null => {
  const ultimoAnioCompleto =
    obtenerUltimoAnioCompleto(periodosData);

  if (ultimoAnioCompleto === null) {
    return null;
  }

  return (
    periodosData.find(
      (periodo) =>
        periodo.anio === ultimoAnioCompleto &&
        periodo.semestre === 'I'
    ) ?? null
  );
};



  const loadData = async (selectedProgram: string, selectedPeriod: string) => {
    try {
      setFetchError(null);
      const result = await fetchDashboardData(selectedProgram, selectedPeriod);
      setData(result);
    } catch (err: any) {
      setFetchError(err.message || 'No se pudo conectar con el servidor backend');
    }
  };

useEffect(() => {
  const loadInitialData = async () => {
    try {
      setFetchError(null);

      const [programasData, periodosData] = await Promise.all([
        studentAlumniService.obtenerProgramas(),
        studentAlumniService.obtenerPeriodos(),
      ]);

      setProgramas(programasData);
      setPeriodos(periodosData);

      if (programasData.length === 0) {
        throw new Error('No existen programas académicos registrados.');
      }

      if (periodosData.length === 0) {
        throw new Error('No existen períodos académicos registrados.');
      }

      /*
       * Seleccionamos automáticamente el primer programa
       * disponible en la base de datos.
       */
     const programaInicial =
        programasData.find(
          (programa) => programa.nombre === 'Ingeniería de Sistemas'
        ) ?? programasData[0];

      setProgram(programaInicial.nombre);
      setProgramaId(programaInicial.id);
      /*
       * Buscamos el último año que tenga los dos semestres:
       *
       * 2024-I  ✅
       * 2024-II ✅
       *
       * 2025-I  ✅
       * 2025-II ✅
       *
       * 2026-I  ✅
       * 2026-II ❌
       *
       * Resultado: 2025
       */
      const periodoInicial =
        obtenerPeriodoCohorteInicial(periodosData);

      if (!periodoInicial) {
        throw new Error(
          'No existe ningún año académico completamente finalizado.'
        );
      }

      const periodoInicialValue =
        obtenerValorPeriodo(periodoInicial);

      setPeriod(periodoInicialValue);

      /*
       * Este ID será utilizado por Análisis de Cohortes.
       *
       * Ejemplo:
       * 2025-I → ID 3
       */
      setPeriodoCohorteId(periodoInicial.id);

      /*
       * Cargamos el dashboard usando exactamente
       * los valores obtenidos de PostgreSQL.
       */
      await loadData(
        programaInicial.nombre,
        periodoInicialValue
      );

      setIsInitialLoading(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo inicializar el dashboard.';

      setFetchError(message);
      setIsInitialLoading(false);
    }
  };

  void loadInitialData();
}, []);

  
  const handleOpenReportModal = () => {
    setIsModalClosing(false);
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowReportModal(false);
      setIsModalClosing(false);
    }, 240);
  };

  useEffect(() => {
    if (showReportModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showReportModal]);

  const handleTabChange = (newTab: TabType) => {
    if (newTab === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(newTab);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 380);
  };

    const handleProgramChange = async (val: string) => {
    const programaSeleccionado = programas.find(
      (item) => item.nombre === val
    );

    if (!programaSeleccionado) {
      return;
    }

    try {
      setIsTabLoading(true);

      setProgram(programaSeleccionado.nombre);
      setProgramaId(programaSeleccionado.id);

      await loadData(
        programaSeleccionado.nombre,
        period
      );
    } finally {
      setIsTabLoading(false);
    }
  };

  const handlePeriodChange = async (val: string) => {
    const periodoSeleccionado = periodos.find(
      (item) => obtenerValorPeriodo(item) === val
    );

    if (!periodoSeleccionado) {
      return;
    }

    try {
      setIsTabLoading(true);

      setPeriod(val);
      setPeriodoCohorteId(periodoSeleccionado.id);

      await loadData(program, val);
    } finally {
      setIsTabLoading(false);
    }
  };


  
  const handleSemesterChange = (val: string) => {
    setIsTabLoading(true);
    setSemester(val);
    setTimeout(() => setIsTabLoading(false), 250);
  };

  const handleResetFilters = async () => {
  if (programas.length === 0 || periodos.length === 0) {
    return;
  }

  const programaInicial =
  programas.find(
    (programa) => programa.nombre === 'Ingeniería de Sistemas'
  ) ?? programas[0];
  const periodoInicial =
    obtenerPeriodoCohorteInicial(periodos);

  if (!periodoInicial) {
    return;
  }

  const periodoInicialValue =
    obtenerValorPeriodo(periodoInicial);

  try {
    setIsTabLoading(true);

    setProgram(programaInicial.nombre);
    setProgramaId(programaInicial.id);

    setPeriod(periodoInicialValue);
    setPeriodoCohorteId(periodoInicial.id);

    setSemester('Todos');

    await loadData(
      programaInicial.nombre,
      periodoInicialValue
    );
  } finally {
    setIsTabLoading(false);
  }
};

  const handleRefresh = async () => {
    setIsTabLoading(true);
    await loadData(program, period);
    setTimeout(() => setIsTabLoading(false), 350);
  };

  if (isInitialLoading || !data) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 space-y-5">
        <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#67a623] via-[#8ecb4b] to-[#548a1a] shadow-xl shadow-[#67a623]/25 animate-pulse">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-loading.png"
            alt={i18n.navbar.logoAlt}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-white p-0.5 border border-white/50"
          />
        </div>

        {!fetchError ? (
          <>
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin text-[#67a623]" />
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide">
                {i18n.initialLoader.title}
              </span>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {i18n.initialLoader.faculty}
              </p>
              <p className="text-[11px] text-[#548a1a] dark:text-[#afdd7a] font-medium">
                {i18n.initialLoader.status}
              </p>
            </div>

            <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300/60 dark:border-slate-700">
              <div className="h-full bg-gradient-to-r from-[#67a623] via-[#8ecb4b] to-[#548a1a] animate-pulse" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3.5 p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 rounded-3xl max-w-md text-center shadow-xl">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-300">
              <AlertTriangle className="w-6 h-6 shrink-0" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base">No se pudo obtener la información</h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                {fetchError}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer mt-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar Conexión
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 dark:bg-slate-950 pb-16">
      
      <Navbar
        onExportReport={handleOpenReportModal}
        onRefresh={handleRefresh}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#152708] to-slate-900 text-white shadow-xl relative overflow-hidden border border-[#355516]/60">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#67a623]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="px-3 py-1 text-xs font-bold bg-[#67a623]/20 text-[#afdd7a] border border-[#67a623]/40 rounded-full cursor-help"
                  title={`Código SNIES Oficial: ${data.programInfo.sniesCode}`}
                >
                  SNIES: {data.programInfo.sniesCode}
                </span>
                <span 
                  className="px-3 py-1 text-xs font-bold bg-[#548a1a]/25 text-[#ceeaad] border border-[#548a1a]/40 rounded-full cursor-help"
                  title={`Acreditación: ${data.programInfo.accreditation}`}
                >
                  {data.programInfo.accreditation}
                </span>
              </div>
              <h2 
                className="text-2xl md:text-3xl font-black tracking-tight truncate cursor-help"
                title={data.programInfo.name}
              >
                {data.programInfo.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span title={`${i18n.banner.directorLabel}: ${data.programInfo.director}`}>{i18n.banner.directorLabel}: <strong>{data.programInfo.director}</strong></span>
                <span className="hidden sm:inline">•</span>
                <span title={`${i18n.banner.modalityLabel} ${data.programInfo.modality} con duración de ${data.programInfo.durationSemesters} semestres`}>{i18n.banner.modalityLabel} {data.programInfo.modality} ({data.programInfo.durationSemesters} {i18n.banner.semestersLabel})</span>
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center shrink-0">
              <div className="text-right hidden lg:block">
                <span className="text-[11px] uppercase font-bold text-slate-400">{i18n.banner.cnaStatusTitle}</span>
                <p className="text-xs font-semibold text-[#afdd7a] flex items-center justify-end gap-1" title={i18n.banner.cnaStatusTooltip}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> {i18n.banner.cnaStatusValue}
                </p>
              </div>
            </div>
          </div>
        </div>

        <FilterBar
  faculty={faculty}
  program={program}
  period={period}
  semester={semester}
  programas={programas}
  periodos={periodos}
  onProgramChange={handleProgramChange}
  onPeriodChange={handlePeriodChange}
  onSemesterChange={handleSemesterChange}
  onResetFilters={handleResetFilters}
/>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200/90 dark:border-slate-800">
          
          <button
            onClick={() => handleTabChange('academic')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 focus:outline-none ${
              activeTab === 'academic'
                ? 'bg-gradient-to-r from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {i18n.tabs.academic}
          </button>


            <button
  onClick={() => handleTabChange('cohort')}
  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 focus:outline-none ${
    activeTab === 'cohort'
      ? 'bg-gradient-to-r from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20'
      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
  }`}
>
  <Users className="w-4 h-4" />
  Análisis de Cohortes
</button>



          <button
            onClick={() => handleTabChange('faculty')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 focus:outline-none ${
              activeTab === 'faculty'
                ? 'bg-gradient-to-r from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            {i18n.tabs.faculty} ({data.faculty.total})
          </button>

          <button
            onClick={() => handleTabChange('research')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 focus:outline-none ${
              activeTab === 'research'
                ? 'bg-gradient-to-r from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <Microscope className="w-4 h-4" />
            {i18n.tabs.research} ({data.research.groups.length})
          </button>

          <button
            onClick={() => handleTabChange('externalRelations')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 focus:outline-none ${
              activeTab === 'externalRelations'
                ? 'bg-gradient-to-r from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            {i18n.tabs.externalRelations} ({data.externalRelations.nationalAgreements + data.externalRelations.internationalAgreements})
          </button>

          <button
            onClick={() => handleTabChange('graduates')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 focus:outline-none ${
              activeTab === 'graduates'
                ? 'bg-gradient-to-r from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            {i18n.tabs.graduates} ({data.graduates.employmentRate})
          </button>

        </div>

        {isTabLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-slate-200/80 dark:bg-slate-800/60 p-5 flex flex-col justify-between border border-slate-300/50 dark:border-slate-700/50">
                  <div className="h-4 w-28 bg-slate-300/80 dark:bg-slate-700/80 rounded-md" />
                  <div className="h-8 w-20 bg-slate-300/80 dark:bg-slate-700/80 rounded-lg" />
                  <div className="h-3 w-36 bg-slate-300/80 dark:bg-slate-700/80 rounded-md" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 rounded-2xl bg-slate-200/80 dark:bg-slate-800/60 p-6 flex flex-col justify-between border border-slate-300/50 dark:border-slate-700/50">
                <div className="h-5 w-48 bg-slate-300/80 dark:bg-slate-700/80 rounded-md" />
                <div className="h-52 w-full bg-slate-300/50 dark:bg-slate-700/50 rounded-xl" />
              </div>
              <div className="h-80 rounded-2xl bg-slate-200/80 dark:bg-slate-800/60 p-6 flex flex-col justify-between border border-slate-300/50 dark:border-slate-700/50">
                <div className="h-5 w-48 bg-slate-300/80 dark:bg-slate-700/80 rounded-md" />
                <div className="h-52 w-full bg-slate-300/50 dark:bg-slate-700/50 rounded-xl" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-[#406a16] dark:text-[#afdd7a]">
              <Loader2 className="w-4 h-4 animate-spin text-[#67a623]" />
              <span>{i18n.tabLoader.status}</span>
            </div>
          </div>
        ) : (
          <div key={activeTab} className="animate-tab-fade">
            {activeTab === 'academic' && (
              <AcademicPerformanceTab data={data} semesterFilter={semester} />
            )}

                  {activeTab === 'cohort' && (
          programaId !== null &&
          periodoCohorteId !== null && (
            <CohortAnalysisTab
              programaId={programaId}
              periodoCohorteId={periodoCohorteId}
            />
          )
)}

            {activeTab === 'faculty' && (
              <FacultyTab data={data} />
            )}

            {activeTab === 'research' && (
              <ResearchTab data={data} />
            )}

            {activeTab === 'externalRelations' && (
              <ExternalRelationsTab data={data} />
            )}

            {activeTab === 'graduates' && (
              <GraduatesTab data={data} />
            )}
          </div>
        )}

      </main>

      {showReportModal && (
        <div
          id="printable-modal-backdrop"
          onClick={handleCloseReportModal}
          className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 ${
            isModalClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
          }`}
        >
          <div
            id="printable-report"
            onClick={(e) => e.stopPropagation()}
            className={`bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 ${
              isModalClosing ? 'animate-modal-out' : 'animate-modal-in'
            }`}
          >
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://www.unicesar.edu.co/wp-content/uploads/2026/08/Logo-Unicesar-2026.webp"
                  alt="Unicesar"
                  className="h-10 w-auto object-contain hidden print:block"
                />
                <div className="p-2.5 bg-[#f4faec] dark:bg-[#152708] text-[#67a623] rounded-xl print:hidden">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white print:text-black">
                    {i18n.reportModal.title}
                  </h3>
                  <p className="text-xs text-slate-500 print:text-slate-700 font-medium">
                    {data.programInfo.name} — SNIES {data.programInfo.sniesCode} — Periodo {period}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseReportModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 print:text-black print:space-y-2">
              <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 print:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 print-no-break">
                <h4 className="font-bold text-slate-900 dark:text-white print:text-black mb-1.5 uppercase text-xs tracking-wider">
                  {i18n.reportModal.section1Title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>{i18n.reportModal.matrículaLabel} <strong>{data.students.totalEnrolled} alumnos</strong></div>
                  <div>{i18n.reportModal.newLabel} <strong>{data.students.newStudents} estudiantes</strong></div>
                  <div>{i18n.reportModal.approvalLabel} <strong className="text-[#67a623] print:text-black">{data.students.approvalRate}</strong></div>
                  <div>{i18n.reportModal.dropoutLabel} <strong>{data.students.dropoutRate}</strong></div>
                  <div>{i18n.reportModal.avgGraduationLabel} <strong>{data.students.averageGraduationSemesters} Semestres</strong></div>
                  <div>{i18n.reportModal.metaGraduationLabel} <strong>{data.students.targetGraduationSemesters} Semestres</strong></div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 print:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 print-no-break">
                <h4 className="font-bold text-slate-900 dark:text-white print:text-black mb-1.5 uppercase text-xs tracking-wider">
                  {i18n.reportModal.section2Title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>{i18n.reportModal.totalFacultyLabel} <strong>{data.faculty.total} profesores</strong></div>
                  <div>{i18n.reportModal.fullTimeLabel} <strong>{data.faculty.fullTime} docentes</strong></div>
                  <div>{i18n.reportModal.phdPercentLabel} <strong className="text-[#67a623] print:text-black">{data.faculty.educationLevel.find(n => n.nivel === 'Doctorado')?.porcentaje}%</strong></div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 print:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-800 print:border-slate-300 print-no-break">
                <h4 className="font-bold text-slate-900 dark:text-white print:text-black mb-1.5 uppercase text-xs tracking-wider">
                  {i18n.reportModal.section3Title}
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>{i18n.reportModal.mincienciasLabel}</strong> {data.research.groups.map(g => `${g.nombre} (Cat. ${g.categoria})`).join(', ')}.</li>
                  <li>• <strong>{i18n.reportModal.indexedLabel}</strong> {data.research.scopusIndexed} artículos en Scopus / Web of Science.</li>
                  <li>• <strong>{i18n.reportModal.agreementsLabel}</strong> {data.externalRelations.nationalAgreements} Nacionales y {data.externalRelations.internationalAgreements} Internacionales.</li>
                  <li>• <strong>{i18n.reportModal.employabilityLabel}</strong> {data.graduates.employmentRate} con tiempo promedio de enganche de {data.graduates.timeToEmploymentMonths} meses.</li>
                </ul>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 print:text-slate-600 flex justify-between items-center print-no-break border-t border-slate-200 dark:border-slate-800 print:border-slate-300 mt-2">
                <span>{i18n.reportModal.generatedBy}</span>
                <span>Director(a): {data.programInfo.director}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 print:hidden">
              <button
                onClick={handleCloseReportModal}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {i18n.reportModal.closeButton}
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#67a623] hover:bg-[#548a1a] text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                {i18n.reportModal.printButton}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
