'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BriefcaseBusiness,
  GraduationCap,
  Clock3,
  TrendingUp,
  Users,
  Building2,
  FileText,
  BookOpen,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

import { studentAlumniService } from '@/services/student-alumni.service';
import {
  AnalisisEgresado,
  SeguimientoEgresado,
} from '@/types/student-alumni';

interface GraduateAnalysisTabProps {
  programaId: number | null;
}

const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

export default function GraduateAnalysisTab({
  programaId,
}: GraduateAnalysisTabProps) {
  const [historico, setHistorico] = useState<SeguimientoEgresado[]>([]);
  const [analisis, setAnalisis] = useState<AnalisisEgresado | null>(null);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarHistorico = async () => {
    if (!programaId) {
      setHistorico([]);
      setAnalisis(null);
      setAnioSeleccionado(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const datos = await studentAlumniService.obtenerSeguimientoEgresados(
        programaId
      );

      const ordenados = [...datos].sort(
        (a, b) => a.anioGraduacion - b.anioGraduacion
      );

      setHistorico(ordenados);

      if (ordenados.length === 0) {
        setAnalisis(null);
        setAnioSeleccionado(null);
        return;
      }

      const ultimo = ordenados[ordenados.length - 1];

      setAnioSeleccionado(ultimo.anioGraduacion);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar el análisis de egresados.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void cargarHistorico();
  }, [programaId]);

  useEffect(() => {
    const cargarAnalisis = async () => {
      if (!programaId || !anioSeleccionado) {
        setAnalisis(null);
        return;
      }

      try {
        setIsAnalysisLoading(true);
        setError(null);

        const resultado =
          await studentAlumniService.obtenerAnalisisEgresado(
            programaId,
            anioSeleccionado
          );

        setAnalisis(resultado);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el análisis seleccionado.'
        );
      } finally {
        setIsAnalysisLoading(false);
      }
    };

    void cargarAnalisis();
  }, [programaId, anioSeleccionado]);

  const sectores = useMemo(
    () =>
      (analisis?.distribuciones ?? [])
        .filter((item) => item.tipo === 'SECTOR')
        .sort((a, b) => b.cantidad - a.cantidad),
    [analisis]
  );

  const cargos = useMemo(
    () =>
      (analisis?.distribuciones ?? [])
        .filter((item) => item.tipo === 'CARGO')
        .sort((a, b) => b.cantidad - a.cantidad),
    [analisis]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando análisis de egresados...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />

          <div>
            <h3 className="font-semibold text-red-700 dark:text-red-400">
              No se pudo cargar la información
            </h3>

            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void cargarHistorico()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (historico.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
        <GraduationCap className="mx-auto w-10 h-10 text-slate-400" />

        <h3 className="mt-3 font-semibold text-slate-700 dark:text-slate-200">
          Sin datos de egresados
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Este programa todavía no tiene información registrada.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#67a623]" />

            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Análisis de Egresados
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Seguimiento histórico de empleabilidad, relación con la carrera y
            trayectoria profesional.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="graduate-year"
            className="text-xs font-semibold text-slate-500"
          >
            Año de graduación
          </label>

          <select
            id="graduate-year"
            value={anioSeleccionado ?? ''}
            onChange={(event) =>
              setAnioSeleccionado(Number(event.target.value))
            }
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#67a623]/30"
          >
            {historico.map((item) => (
              <option
                key={item.anioGraduacion}
                value={item.anioGraduacion}
              >
                {item.anioGraduacion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isAnalysisLoading || !analisis ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando datos del año...</span>
          </div>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total egresados"
              value={analisis.totalEgresados}
              icon={Users}
              description={`Graduados en ${analisis.anioGraduacion}`}
            />

            <KpiCard
              title="Empleabilidad"
              value={formatPercentage(analisis.tasaEmpleabilidad)}
              icon={BriefcaseBusiness}
              description={`${analisis.empleados} egresados empleados`}
            />

            <KpiCard
              title="Relacionados con la carrera"
              value={formatPercentage(analisis.tasaRelacionCarrera)}
              icon={TrendingUp}
              description={`${analisis.empleadosRelacionadosCarrera} empleados relacionados`}
            />

            <KpiCard
              title="Tiempo de vinculación"
              value={
                analisis.tiempoPromedioConseguirEmpleoMeses !== null
                  ? `${analisis.tiempoPromedioConseguirEmpleoMeses.toFixed(1)} meses`
                  : 'Sin dato'
              }
              icon={Clock3}
              description="Promedio para conseguir empleo"
            />
          </div>

          {/* Historical employment */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="mb-5">
              <h3 className="font-bold text-slate-800 dark:text-white">
                Evolución de empleabilidad
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Comportamiento histórico del porcentaje de egresados empleados.
              </p>
            </div>

            <div className="space-y-4">
              {historico.map((item) => (
                <div key={item.anioGraduacion}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {item.anioGraduacion}
                    </span>

                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {formatPercentage(item.tasaEmpleabilidad)}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-[#67a623] transition-all"
                      style={{
                        width: `${Math.min(item.tasaEmpleabilidad, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employment relation */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <InfoPanel
              title="Relación laboral con la carrera"
              icon={BriefcaseBusiness}
            >
              <DistributionRow
                label="Relacionados con la carrera"
                value={analisis.empleadosRelacionadosCarrera}
                total={analisis.empleados}
              />

              <DistributionRow
                label="No relacionados"
                value={analisis.empleadosNoRelacionadosCarrera}
                total={analisis.empleados}
              />
            </InfoPanel>

            <InfoPanel
              title="Continuidad académica"
              icon={BookOpen}
            >
              <DistributionRow
                label="Continúan estudios"
                value={analisis.continuanEstudios}
                total={analisis.totalEgresados}
              />

              <DistributionRow
                label="No continúan estudios"
                value={
                  analisis.totalEgresados - analisis.continuanEstudios
                }
                total={analisis.totalEgresados}
              />
            </InfoPanel>
          </div>

          {/* Contracts */}
          <InfoPanel
            title="Tipo de contratación"
            icon={FileText}
          >
            <DistributionRow
              label="Contrato indefinido"
              value={analisis.contratoIndefinido}
              total={analisis.empleados}
            />

            <DistributionRow
              label="Término fijo"
              value={analisis.contratoTerminoFijo}
              total={analisis.empleados}
            />

            <DistributionRow
              label="Prestación de servicios"
              value={analisis.contratoPrestacionServicios}
              total={analisis.empleados}
            />

            <DistributionRow
              label="Otro"
              value={analisis.contratoOtro}
              total={analisis.empleados}
            />
          </InfoPanel>

          {/* Sector / Cargo */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DistributionList
              title="Sectores de vinculación"
              icon={Building2}
              items={sectores}
            />

            <DistributionList
              title="Cargos ocupados"
              icon={BriefcaseBusiness}
              items={cargos}
            />
          </div>
        </>
      )}
    </section>
  );
}

interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-[#67a623]/10 p-2.5">
          <Icon className="w-5 h-5 text-[#67a623]" />
        </div>
      </div>
    </div>
  );
}

interface InfoPanelProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function InfoPanel({
  title,
  icon: Icon,
  children,
}: InfoPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="mb-5 flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#67a623]" />

        <h3 className="font-bold text-slate-800 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="space-y-5">{children}</div>
    </div>
  );
}

interface DistributionRowProps {
  label: string;
  value: number;
  total: number;
}

function DistributionRow({
  label,
  value,
  total,
}: DistributionRowProps) {
  const percentage =
    total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>

        <span className="font-bold text-slate-700 dark:text-slate-200">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-[#67a623]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface DistributionListProps {
  title: string;
  icon: React.ElementType;
  items: {
    categoria: string;
    cantidad: number;
  }[];
}

function DistributionList({
  title,
  icon: Icon,
  items,
}: DistributionListProps) {
  const total = items.reduce(
    (sum, item) => sum + item.cantidad,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="mb-5 flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#67a623]" />

        <h3 className="font-bold text-slate-800 dark:text-white">
          {title}
        </h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">
          No hay información disponible.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const percentage =
              total > 0 ? (item.cantidad / total) * 100 : 0;

            return (
              <div key={`${item.categoria}-${item.cantidad}`}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {item.categoria}
                  </span>

                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {item.cantidad}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-[#67a623]"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}