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
    <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-md shadow-emerald-500/10">
      <div className="mb-2 flex items-center justify-between text-emerald-100">
        <span className="text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>

        {icon}
      </div>

      <p className="text-3xl font-extrabold">{value}</p>

      <p className="mt-1 text-xs text-emerald-100">
        {description}
      </p>
    </div>
  );
}

/**
 * Convierte el número de seguimiento en el período académico
 * correspondiente a partir del período de ingreso de la cohorte.
 *
 * Ejemplo:
 * Cohorte 2024-1
 * seguimiento 1 -> 2024-1
 * seguimiento 2 -> 2024-2
 * seguimiento 3 -> 2025-1
 * seguimiento 4 -> 2025-2
 */
function calcularPeriodoAcademico(
  anioCohorte: number,
  semestreCohorte: string,
  seguimiento: number
): string {
  const semestreInicial =
    semestreCohorte === 'II' || semestreCohorte === '2' ? 2 : 1;

  const indicePeriodo =
    semestreInicial - 1 + (seguimiento - 1);

  const anio = anioCohorte + Math.floor(indicePeriodo / 2);

  const semestre = (indicePeriodo % 2) + 1;

  return `${anio}-${semestre}`;
}

export function CohortAnalysisTab({
  programaId,
  periodoCohorteId,
}: CohortAnalysisTabProps) {
  const [data, setData] = useState<SeguimientoCohorte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [periodoCohorte, setPeriodoCohorte] = useState<{
    anio: number;
    semestre: string;
  } | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resultado, periodos] = await Promise.all([
        studentAlumniService.obtenerSeguimientoCohorte(
          programaId,
          periodoCohorteId
        ),
        studentAlumniService.obtenerPeriodos(),
      ]);

      setData(resultado);

      const periodo = periodos.find(
        (item) => item.id === periodoCohorteId
      );

      if (periodo) {
        setPeriodoCohorte({
          anio: periodo.anio,
          semestre: periodo.semestre,
        });
      } else {
        setPeriodoCohorte(null);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'No fue posible cargar el seguimiento de la cohorte.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, [programaId, periodoCohorteId]);

  const resumen = useMemo(() => {
    if (data.length === 0) {
      return {
        ingresaron: 0,
        continuaron: 0,
        cancelaciones: 0,
        desertores: 0,
        graduados: 0,
      };
    }

    return data.reduce(
      (acc, item) => ({
        ingresaron: Math.max(
          acc.ingresaron,
          item.ingresaron
        ),

        continuaron: Math.max(
          acc.continuaron,
          item.continuaron
        ),

        cancelaciones:
          acc.cancelaciones + item.cancelaciones,

        desertores:
          acc.desertores + item.desertores,

        graduados: Math.max(
          acc.graduados,
          item.graduados
        ),
      }),
      {
        ingresaron: 0,
        continuaron: 0,
        cancelaciones: 0,
        desertores: 0,
        graduados: 0,
      }
    );
  }, [data]);

  /**
   * Ordenamos explícitamente por seguimiento.
   *
   * Esto garantiza que aunque la API devuelva los registros
   * en otro orden, la gráfica siempre mantenga la secuencia.
   */
  const datosOrdenados = useMemo(
    () =>
      [...data].sort(
        (a, b) =>
          a.semestreSeguimiento -
          b.semestreSeguimiento
      ),
    [data]
  );

  const chartData = useMemo<ChartDataItem[]>(() => {
    return datosOrdenados.map((item) => {
      const periodo = periodoCohorte
        ? calcularPeriodoAcademico(
            periodoCohorte.anio,
            periodoCohorte.semestre,
            item.semestreSeguimiento
          )
        : `Seguimiento ${item.semestreSeguimiento}`;

      return {
        seguimiento: item.semestreSeguimiento,
        periodo,
        ingresaron: item.ingresaron,
        continuaron: item.continuaron,
        cancelaciones: item.cancelaciones,
        repitentes: item.repitentes,
        cambiosPrograma: item.cambiosPrograma,
        desertores: item.desertores,
        graduados: item.graduados,
      };
    });
  }, [datosOrdenados, periodoCohorte]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Cargando seguimiento de cohorte...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3">
          <AlertTriangle className="h-8 w-8 text-rose-500" />

          <p className="text-center text-sm text-slate-600 dark:text-slate-300">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void cargarDatos()}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
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
          <p className="text-sm text-slate-500">
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
            <Users className="h-5 w-5 text-emerald-200" />
          }
        />

        <MetricCard
          title="Continuaron"
          value={resumen.continuaron}
          description="Mayor permanencia registrada"
          icon={
            <CheckCircle className="h-5 w-5 text-emerald-200" />
          }
        />

        <MetricCard
          title="Desertores"
          value={resumen.desertores}
          description="Deserciones registradas"
          icon={
            <TrendingDown className="h-5 w-5 text-emerald-200" />
          }
        />

        <MetricCard
          title="Graduados"
          value={resumen.graduados}
          description="Graduados registrados"
          icon={
            <GraduationCap className="h-5 w-5 text-emerald-200" />
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

                      return `${label} · Seguimiento ${item.seguimiento}`;
                    }}
                  />

                  <Bar
                    dataKey="continuaron"
                    name="Continuaron"
                    fill="#10b981"
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
                    fill="#059669"
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
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-4 py-3">
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

                  <th className="px-4 py-3">
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
                      {item.seguimiento}
                    </td>

                    <td className="px-4 py-3">
                      {item.ingresaron}
                    </td>

                    <td className="px-4 py-3 font-semibold text-emerald-600">
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

                    <td className="px-4 py-3 font-semibold text-emerald-700">
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