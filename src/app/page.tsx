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
import GraduateAnalysisTab from '@/components/tabs/graduate-analysis-tab';

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

// Cache a nivel de módulo para evitar volver a mostrar la pantalla de carga al navegar entre rutas
let cachedDashboardData: DashboardData | null = null;
let cachedProgramas: Programa[] = [];
let cachedPeriodos: Periodo[] = [];
let cachedProgram: string = '';
let cachedPeriod: string = '';
let cachedProgramaId: number | null = null;
let cachedPeriodoCohorteId: number | null = null;
let isAppInitialized = false;

export default function DashboardPage() {
  const [isInitialLoading, setIsInitialLoading] = useState(!isAppInitialized);

  const [faculty] = useState('Facultad de Ingeniería y Tecnologías');
  const [program, setProgram] = useState(cachedProgram);
  const [period, setPeriod] = useState(cachedPeriod);
  const [semester, setSemester] = useState('Todos');

  const [programaId, setProgramaId] = useState<number | null>(cachedProgramaId);
  const [periodoCohorteId, setPeriodoCohorteId] = useState<number | null>(cachedPeriodoCohorteId);
  const [programas, setProgramas] = useState<Programa[]>(cachedProgramas);
  const [periodos, setPeriodos] = useState<Periodo[]>(cachedPeriodos);
  const [activeTab, setActiveTab] = useState<TabType>('academic');
  const [isTabLoading, setIsTabLoading] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const [data, setData] = useState<DashboardData | null>(cachedDashboardData);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const obtenerValorPeriodo = (periodoObj: Periodo): string => {
    return `${periodoObj.anio}-${periodoObj.semestre === 'I' ? '1' : '2'}`;
  };

  const obtenerUltimoAnioCompleto = (
    periodosData: Periodo[]
  ): number | null => {
    const anios = [...new Set(periodosData.map((p) => p.anio))].sort((a, b) => b - a);

    const ultimoAnioCompleto = anios.find((anio) => {
      const tienePrimerSemestre = periodosData.some(
        (p) => p.anio === anio && p.semestre === 'I'
      );
      const tieneSegundoSemestre = periodosData.some(
        (p) => p.anio === anio && p.semestre === 'II'
      );
      return tienePrimerSemestre && tieneSegundoSemestre;
    });

    return ultimoAnioCompleto ?? null;
  };

  const obtenerPeriodoCohorteInicial = (
    periodosData: Periodo[]
  ): Periodo | null => {
    const ultimoAnioCompleto = obtenerUltimoAnioCompleto(periodosData);
    if (ultimoAnioCompleto === null) {
      return null;
    }
    return (
      periodosData.find(
        (p) => p.anio === ultimoAnioCompleto && p.semestre === 'I'
      ) ?? null
    );
  };

  const loadData = async (selectedProgram: string, selectedPeriod: string) => {
    try {
      setFetchError(null);
      const result = await fetchDashboardData(selectedProgram, selectedPeriod);
      setData(result);
      cachedDashboardData = result;
    } catch (err: any) {
      setFetchError(err.message || 'No se pudo conectar con el servidor backend');
    }
  };

  useEffect(() => {
    if (isAppInitialized && cachedDashboardData) {
      return;
    }

    const loadInitialData = async () => {
      try {
        setFetchError(null);

        const [programasData, periodosData] = await Promise.all([
          studentAlumniService.obtenerProgramas(),
          studentAlumniService.obtenerPeriodos(),
        ]);

        setProgramas(programasData);
        setPeriodos(periodosData);
        cachedProgramas = programasData;
        cachedPeriodos = periodosData;

        if (programasData.length === 0) {
          throw new Error('No existen programas académicos registrados.');
        }

        if (periodosData.length === 0) {
          throw new Error('No existen períodos académicos registrados.');
        }

        const programaInicial =
          programasData.find((p) => p.nombre === 'Ingeniería de Sistemas') ?? programasData[0];

        setProgram(programaInicial.nombre);
        setProgramaId(programaInicial.id);
        cachedProgram = programaInicial.nombre;
        cachedProgramaId = programaInicial.id;

        const periodoInicial = obtenerPeriodoCohorteInicial(periodosData) ?? periodosData[0];

        const periodoInicialValue = obtenerValorPeriodo(periodoInicial);

        setPeriod(periodoInicialValue);
        setPeriodoCohorteId(periodoInicial.id);
        cachedPeriod = periodoInicialValue;
        cachedPeriodoCohorteId = periodoInicial.id;

        const result = await fetchDashboardData(
          programaInicial.nombre,
          periodoInicialValue
        );

        setData(result);
        cachedDashboardData = result;
        isAppInitialized = true;
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

  const handleProgramChange = (newProgram: string) => {
    setProgram(newProgram);
    cachedProgram = newProgram;
    const selectedProg = programas.find((p) => p.nombre === newProgram);
    if (selectedProg) {
      setProgramaId(selectedProg.id);
      cachedProgramaId = selectedProg.id;
    }
    void loadData(newProgram, period);
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    cachedPeriod = newPeriod;
    const [anioStr, semNumStr] = newPeriod.split('-');
    const targetAnio = parseInt(anioStr, 10);
    const targetSemestre = semNumStr === '1' ? 'I' : 'II';
    const selectedPeriodo = periodos.find(
      (p) => p.anio === targetAnio && p.semestre === targetSemestre
    );
    if (selectedPeriodo) {
      setPeriodoCohorteId(selectedPeriodo.id);
      cachedPeriodoCohorteId = selectedPeriodo.id;
    }
    void loadData(program, newPeriod);
  };

  const handleSemesterChange = (newSemester: string) => {
    setSemester(newSemester);
  };

  const handleResetFilters = () => {
    if (programas.length > 0) {
      const pInit = programas.find((p) => p.nombre === 'Ingeniería de Sistemas') ?? programas[0];
      setProgram(pInit.nombre);
      setProgramaId(pInit.id);
      cachedProgram = pInit.nombre;
      cachedProgramaId = pInit.id;
    }
    if (periodos.length > 0) {
      const perInit = obtenerPeriodoCohorteInicial(periodos) ?? periodos[0];
      const val = obtenerValorPeriodo(perInit);
      setPeriod(val);
      setPeriodoCohorteId(perInit.id);
      cachedPeriod = val;
      cachedPeriodoCohorteId = perInit.id;
      void loadData(program, val);
    }
    setSemester('Todos');
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 280);
  };

  const availablePeriods = periodos.map((p) => `${p.anio}-${p.semestre === 'I' ? '1' : '2'}`);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#67a623]/20 border-t-[#67a623] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#67a623]" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cargando Panel de Indicadores...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Conectando con la base de datos de la universidad
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl space-y-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Error al conectar con la API
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              {fetchError || 'No se pudo obtener la información de indicadores.'}
            </p>
          </div>
          <button
            onClick={() => {
              isAppInitialized = false;
              setIsInitialLoading(true);
              const p = program || 'Ingeniería de Sistemas';
              const per = period || '2025-1';
              void loadData(p, per).then(() => {
                isAppInitialized = true;
                setIsInitialLoading(false);
              });
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#67a623] hover:bg-[#548a1a] text-white text-xs font-bold rounded-xl w-full shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  const totalAgreements = data.externalRelations.nationalAgreements + data.externalRelations.internationalAgreements;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      <Navbar onExportReport={handleOpenReportModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-gradient-to-r from-[#406a16] via-[#548a1a] to-[#67a623] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#67a623]/10 mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-[#f4faec]">
                <span>Acreditación de Alta Calidad</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {data.programInfo.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-100/90 max-w-2xl leading-relaxed">
                Seguimiento continuo de indicadores para la toma de decisiones estratégicas y autoevaluación.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 space-y-1 text-right w-full sm:w-auto">
                <p className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
                  Estado CNA
                </p>
                <p className="text-xs font-semibold text-[#afdd7a] flex items-center justify-end gap-1" title="El programa cumple con los estándares del CNA">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Autoevaluación al Día
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
          activeTab={activeTab}
          availablePeriods={availablePeriods}
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
            {i18n.tabs.externalRelations} ({totalAgreements})
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
            {i18n.tabs.graduates}
          </button>

        </div>

        {isTabLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-pulse space-y-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
            <div className="h-52 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
            <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-[#406a16] dark:text-[#afdd7a]">
              <Loader2 className="w-4 h-4 animate-spin text-[#67a623]" />
              <span>Cargando datos...</span>
            </div>
          </div>
        ) : (
          <div key={activeTab} className="animate-tab-fade">
            {activeTab === 'academic' && (
              <AcademicPerformanceTab data={data} periodFilter={period} semesterFilter={semester} />
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

            {activeTab === 'graduates' && programaId !== null && (
              <GraduateAnalysisTab programaId={programaId} />
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
                    {data.programInfo.name} - SNIES {data.programInfo.sniesCode} - Periodo {period}
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
                  <div>Matrícula: <strong>{data.students.totalEnrolled} alumnos</strong></div>
                  <div>Nuevos: <strong>{data.students.newStudents} estudiantes</strong></div>
                  <div>Aprobación: <strong className="text-[#67a623] print:text-black">{data.students.approvalRate}</strong></div>
                  <div>Deserción: <strong>{data.students.dropoutRate}</strong></div>
                  <div>Graduación promedio: <strong>{data.students.averageGraduationSemesters} Semestres</strong></div>
                  <div>Meta graduación: <strong>{data.students.targetGraduationSemesters} Semestres</strong></div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 print:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-700 print:border-slate-300 print-no-break">
                <h4 className="font-bold text-slate-900 dark:text-white print:text-black mb-1.5 uppercase text-xs tracking-wider">
                  {i18n.reportModal.section2Title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>Total docentes: <strong>{data.faculty.total} profesores</strong></div>
                  <div>Tiempo completo: <strong>{data.faculty.fullTime} docentes</strong></div>
                  <div>% Ph.D.: <strong className="text-[#67a623] print:text-black">{data.faculty.educationLevel.find(n => n.nivel === 'Doctorado')?.porcentaje}%</strong></div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 print:bg-slate-50 rounded-2xl border border-slate-200 dark:border-slate-800 print:border-slate-300 print-no-break">
                <h4 className="font-bold text-slate-900 dark:text-white print:text-black mb-1.5 uppercase text-xs tracking-wider">
                  {i18n.reportModal.section3Title}
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>  <strong>Grupos MinCiencias:</strong> {data.research.groups.map(g => `${g.nombre} (Cat. ${g.categoria})`).join(', ')}.</li>
                  <li>  <strong>Publicaciones Indexadas:</strong> {data.research.scopusIndexed} artículos en Scopus / Web of Science.</li>
                  <li>  <strong>Convenios:</strong> {data.externalRelations.nationalAgreements} Nacionales y {data.externalRelations.internationalAgreements} Internacionales.</li>
                  <li>  <strong>Empleabilidad:</strong> {data.graduates.employmentRate} con tiempo promedio de enganche de {data.graduates.timeToEmploymentMonths} meses.</li>
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
