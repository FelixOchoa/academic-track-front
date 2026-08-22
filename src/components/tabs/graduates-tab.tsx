'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/data/dashboardMockData';
import { Briefcase, DollarSign, Clock, ThumbsUp, MapPin } from 'lucide-react';
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

const COLORS = ['#10b981', '#059669', '#34d399', '#047857', '#64748b'];

const compactTooltipStyle = {
  backgroundColor: '#022c22',
  borderColor: '#059669',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '11px',
  padding: '6px 10px',
  boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.4)'
};

const compactItemStyle = {
  fontSize: '11px',
  color: '#ecfdf5',
  padding: '1px 0'
};

const compactLabelStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#a7f3d0',
  marginBottom: '2px'
};

export function GraduatesTab({ data }: TabProps) {
  const { egresados } = data;

  return (
    <div className="space-y-6">
      
      {/* Top Metrics con línea visual verde (Emerald / Teal) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Vinculación Laboral</span>
            <Briefcase className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-black">{egresados.tasaVinculacionLaboral}</p>
          <p className="text-xs text-emerald-100 mt-1">Egresados vinculados laboralmente</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tiempo de Enganche</span>
            <Clock className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{egresados.tiempoPromedioEmpleoMeses} meses</p>
          <p className="text-xs text-emerald-100 font-medium mt-1">Promedio posterior a graduación</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ingreso Promedio</span>
            <DollarSign className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{egresados.salarioPromedioSMLV} SMLV</p>
          <p className="text-xs text-emerald-100 mt-1">Salarios competitivos del sector</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-100 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Satisfacción Empleadores</span>
            <ThumbsUp className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl font-extrabold">{egresados.satisfaccionEmpleadores}</p>
          <p className="text-xs text-emerald-100 font-medium mt-1">Valoración positiva del desempeño</p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie: Sectores de Desempeño */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Sectores de Desempeño Laboral
            </CardTitle>
            <CardDescription>
              Distribución de egresados por ámbito industrial y económico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={egresados.sectoresDesempeno}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="porcentaje"
                    nameKey="sector"
                    label={({ sector, porcentaje }) => `${sector}: ${porcentaje}%`}
                  >
                    {egresados.sectoresDesempeno.map((entry, index) => (
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

        {/* Bar: Ubicación Geográfica */}
        <Card>
          <CardHeader>
            <CardTitle>
              <MapPin className="w-5 h-5 text-emerald-600" />
              Ubicación del Ejercicio Profesional
            </CardTitle>
            <CardDescription>
              Inserción en el mercado local, nacional e internacional (remoto/presencial)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={egresados.ubicacionLaboral} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    contentStyle={compactTooltipStyle}
                    itemStyle={compactItemStyle}
                    labelStyle={compactLabelStyle}
                  />
                  <Bar dataKey="porcentaje" name="% Egresados" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
