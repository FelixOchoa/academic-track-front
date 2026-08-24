'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardData } from '@/types/dashboardTypes';
import { Briefcase, DollarSign, Clock, ThumbsUp, MapPin } from 'lucide-react';
import i18n from '@/i18n/es.json';
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

const COLORS = ['#67a623', '#548a1a', '#8ecb4b', '#406a16', '#64748b'];

const compactTooltipStyle = {
  backgroundColor: '#152708',
  borderColor: '#67a623',
  borderRadius: '10px',
  fontSize: '11px',
  padding: '6px 10px',
  boxShadow: '0 10px 20px -3px rgba(0, 0, 0, 0.4)',
  color: '#ffffff'
};

const compactItemStyle = {
  fontSize: '11px',
  padding: '1px 0',
  color: '#ffffff'
};

const compactLabelStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#afdd7a',
  marginBottom: '2px'
};

export function GraduatesTab({ data }: TabProps) {
  const t = i18n.graduatesTab;
  const { graduates } = data;

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7ece28] via-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.kpi.employmentRate}</span>
            <Briefcase className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-black">{graduates.employmentRate}</p>
          <p className="text-xs text-white/90 mt-1">{t.kpi.employmentNote}</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#67a623] to-[#548a1a] text-white shadow-md shadow-[#67a623]/20">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.kpi.timeToEmployment}</span>
            <Clock className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{graduates.timeToEmploymentMonths} meses</p>
          <p className="text-xs text-white/90 font-medium mt-1">{t.kpi.timeNote}</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#77be24] to-[#58921c] text-white shadow-md shadow-[#67a623]/20">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.kpi.averageIncome}</span>
            <DollarSign className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{graduates.averageIncomeSMLV} SMLV</p>
          <p className="text-xs text-white/90 mt-1">{t.kpi.incomeNote}</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#80d429] via-[#67a623] to-[#4e8218] text-white shadow-md shadow-[#67a623]/20">
          <div className="flex items-center justify-between text-white/90 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.kpi.employerSatisfaction}</span>
            <ThumbsUp className="w-5 h-5 text-white/90" />
          </div>
          <p className="text-3xl font-extrabold">{graduates.employerSatisfaction}</p>
          <p className="text-xs text-white/90 font-medium mt-1">{t.kpi.satisfactionNote}</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle>
              <Briefcase className="w-5 h-5 text-[#67a623]" />
              {t.charts.sectorsTitle}
            </CardTitle>
            <CardDescription>
              {t.charts.sectorsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={graduates.performanceSectors}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="porcentaje"
                    nameKey="sector"
                    label={({ sector, porcentaje }) => `${sector}: ${porcentaje}%`}
                    labelLine={false}
                  >
                    {graduates.performanceSectors.map((entry, index) => (
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

        <Card>
          <CardHeader>
            <CardTitle>
              <MapPin className="w-5 h-5 text-[#67a623]" />
              {t.charts.locationTitle}
            </CardTitle>
            <CardDescription>
              {t.charts.locationDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graduates.locationDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    contentStyle={compactTooltipStyle}
                    itemStyle={compactItemStyle}
                    labelStyle={compactLabelStyle}
                  />
                  <Bar dataKey="porcentaje" name={t.charts.graduatesPercentKey} fill="#67a623" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
