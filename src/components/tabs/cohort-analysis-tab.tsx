'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  GraduationCap,
  RefreshCw,
  TrendingDown,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { studentAlumniService } from '@/services/student-alumni.service';
import { SeguimientoCohorte } from '@/types/student-alumni';

interface CohortAnalysisTabProps {
  programaId: number;
  periodoCohorteId: number;
}

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

interface ChartDataItem {
  seguimiento: number;
  periodo: string;
  ingresaron: number;
  continuaron: number;
  cancelaciones: number;
  repitentes: number;
  cambiosPrograma: number;
  desertores: number;
  graduados: number;
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#406a16] via-[#548a1a] to-[#67a623] p-5 text-white shadow-xl shadow-[#67a623]/10">
      <div className="mb-2 flex items-center justify-between text-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider">
          {title}
        </span>

        {icon}
      </div>

      <p className="text-3xl font-black">{value}</p>

      <p className="mt-1 text-xs text-slate-100/90 font-medium">
        {description}
      </p>
    </div>
  );
}

export function CohortAnalysisTab({
  programaId,
  periodoCohorteId,
}: CohortAnalysisTabProps) {
  const [data, setData] = useState<SeguimientoCohorte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await studentAlumniService.obtenerSeguimientoCohorte(
          programaId,
          periodoCohorteId
        );

      setData(response);
    } catch {
      setError(
        'No se pudo obtener la información del análisis de cortes.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, [programaId, periodoCohorteId]);

  const chartData = useMemo<ChartDataItem[]>(() => {
    return data.map((item) => {
      return {
        seguimiento: item.semestreSeguimiento,
        periodo: `Semestre ${item.semestreSeguimiento}`,
        ingresaron: item.ingresaron,
        continuaron: item.continuaron,
        cancelaciones: item.cancelaciones,
        repitentes: item.repitentes,
        cambiosPrograma: item.cambiosPrograma,
        desertores: item.desertores,
        graduados: item.graduados,
      };
    });
  }, [data]);

  const resumen = useMemo(() => {
    if (data.length === 0) {
      return {
        ingresaron: 0,
        continuaron: 0,
        desertores: 0,
        graduados: 0,
      };
    }

    const primerSeguimiento = data[0];
    const maxContinuaron = Math.max(
      ...data.map((item) => item.continuaron)
    );

    const totalDesertores = data.reduce(
      (acc, curr) => acc + curr.desertores,
      0
    );

    const totalGraduados = data.reduce(
      (acc, curr) => acc + curr.graduados,
      0
    );

    return {
      ingresaron: primerSeguimiento.ingresaron,
      continuaron: maxContinuaron,
      desertores: totalDesertores,
      graduados: totalGraduados,
    };
  }, [data]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <RefreshCw className="h-4 w-4 animate-spin text-[#67a623]" />
            Cargando análisis de cortes...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {error}
          </p>
          <button
            onClick={() => void cargarDatos()}
            className="rounded-xl bg-gradient-to-r from-[#67a623] to-[#548a1a] hover:from-[#548a1a] hover:to-[#406a16] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#67a623]/20 transition-all"
          >
            Reintentar
          </button>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-64 items-center justify-center">
          <p className="text-sm text-slate-500 font-medium">
            No existen datos para la cohorte seleccionada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ingresaron"
          value={resumen.ingresaron}
          description="Estudiantes de la cohorte"
          icon={
            <Users className="h-5 w-5 text-[#afdd7a]" />
          }
        />

        <MetricCard
          title="Continuaron"
          value={resumen.continuaron}
          description="Mayor permanencia registrada"
          icon={
            <CheckCircle className="h-5 w-5 text-[#afdd7a]" />
          }
        />

        <MetricCard
          title="Desertores"
          value={resumen.desertores}
          description="Deserciones registradas"
          icon={
            <TrendingDown className="h-5 w-5 text-[#afdd7a]" />
          }
        />

        <MetricCard
          title="Graduados"
          value={resumen.graduados}
          description="Graduados registrados"
          icon={
            <GraduationCap className="h-5 w-5 text-[#afdd7a]" />
          }
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>
            Seguimiento de la Cohorte
          </CardTitle>

          <CardDescription>
            Evolución de la cohorte desde su período de
            ingreso. El seguimiento no está limitado por
            la duración oficial del programa.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto pb-2">
            <div
              className="h-80"
              style={{
                minWidth: `${Math.max(
                  chartData.length * 110,
                  700
                )}px`,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: -20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="periodo"
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />

                  <Tooltip
                    formatter={(
                      value: number,
                      name: string
                    ) => [value, name]}
                    labelFormatter={(
                      label,
                      payload
                    ) => {
                      const item =
                        payload?.[0]
                          ?.payload as ChartDataItem | undefined;

                      if (!item) {
                        return label;
                      }

                      return `${label} – Semestre de seguimiento ${item.seguimiento}`;
                    }}
                  />

                  <Bar
                    dataKey="continuaron"
                    name="Continuaron"
                    fill="#67a623"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="desertores"
                    name="Desertores"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="cancelaciones"
                    name="Cancelaciones"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="graduados"
                    name="Graduados"
                    fill="#548a1a"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Detalle de Permanencia
          </CardTitle>

          <CardDescription>
            Indicadores agregados de la cohorte por período
            académico.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                  <th className="px-4 py-3 rounded-l-xl">
                    Período
                  </th>

                  <th className="px-4 py-3">
                    Seguimiento
                  </th>

                  <th className="px-4 py-3">
                    Ingresaron
                  </th>

                  <th className="px-4 py-3">
                    Continuaron
                  </th>

                  <th className="px-4 py-3">
                    Cancelaciones
                  </th>

                  <th className="px-4 py-3">
                    Repitentes
                  </th>

                  <th className="px-4 py-3">
                    Cambios
                  </th>

                  <th className="px-4 py-3">
                    Desertores
                  </th>

                  <th className="px-4 py-3 rounded-r-xl">
                    Graduados
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {chartData.map((item) => (
                  <tr
                    key={item.seguimiento}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 font-bold">
                      {item.periodo}
                    </td>

                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      Semestre {item.seguimiento}
                    </td>

                    <td className="px-4 py-3">
                      {item.ingresaron}
                    </td>

                    <td className="px-4 py-3 font-semibold text-[#67a623]">
                      {item.continuaron}
                    </td>

                    <td className="px-4 py-3 text-amber-600">
                      {item.cancelaciones}
                    </td>

                    <td className="px-4 py-3">
                      {item.repitentes}
                    </td>

                    <td className="px-4 py-3">
                      {item.cambiosPrograma}
                    </td>

                    <td className="px-4 py-3 font-semibold text-rose-600">
                      {item.desertores}
                    </td>

                    <td className="px-4 py-3 font-semibold text-[#548a1a]">
                      {item.graduados}
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
