import { useState, useEffect } from 'react';
import { BarChart3, FileText, Calendar, TrendingUp, TrendingDown, Car, Bike, Truck, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { reportService } from '../services/reportService';
import { vehicleService } from '../services/vehicleService';
import { registerService } from '../services/registerService';
import type { Vehicle, Register } from '../types/api';

// Mock data for charts (backend doesn't provide historical data yet)
const monthlyRevenueData = [
  { month: 'Sep', ingresos: 18500 },
  { month: 'Oct', ingresos: 22300 },
  { month: 'Nov', ingresos: 19800 },
  { month: 'Dic', ingresos: 25100 },
  { month: 'Ene', ingresos: 23400 },
  { month: 'Feb', ingresos: 27600 },
];

const vehiclesPerMonthData = [
  { month: 'Sep', vehiculos: 145 },
  { month: 'Oct', vehiculos: 178 },
  { month: 'Nov', vehiculos: 162 },
  { month: 'Dic', vehiculos: 195 },
  { month: 'Ene', vehiculos: 210 },
  { month: 'Feb', vehiculos: 234 },
];

const dailyOccupancyData = [
  { hora: '6am', ocupacion: 15 },
  { hora: '8am', ocupacion: 65 },
  { hora: '10am', ocupacion: 82 },
  { hora: '12pm', ocupacion: 90 },
  { hora: '2pm', ocupacion: 78 },
  { hora: '4pm', ocupacion: 70 },
  { hora: '6pm', ocupacion: 55 },
  { hora: '8pm', ocupacion: 30 },
];

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#f59e0b'];

export function Reports() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [lastReport, setLastReport] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [v, r] = await Promise.allSettled([
          vehicleService.getAll(),
          registerService.getAll(),
        ]);
        setVehicles(v.status === 'fulfilled' ? v.value : []);
        setRegisters(r.status === 'fulfilled' ? r.value : []);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const completedRegisters = registers.filter((r) => r.exitdate);
  const totalMinutes = completedRegisters.reduce((sum, r) => sum + r.minutes, 0);
  const avgMinutes = completedRegisters.length > 0 ? Math.round(totalMinutes / completedRegisters.length) : 0;

  const residentCount = vehicles.filter((v) => v.type === 'RESIDENT').length;
  const nonResidentCount = vehicles.filter((v) => v.type === 'NON_RESIDENT').length;
  const oficialCount = vehicles.filter((v) => v.type === 'OFICIAL').length;

  // Real data for PieChart
  const vehicleDistributionData = [
    { name: 'Residentes', value: residentCount },
    { name: 'No Residentes', value: nonResidentCount },
    { name: 'Oficiales', value: oficialCount },
  ];

  const handleGenerateMonthlyReport = async () => {
    setIsGenerating(true);
    try {
      const result = await reportService.generateMonthly();
      setLastReport(result.report_file);
      toast.success('Reporte mensual generado exitosamente');
      toast.info(`Archivo: ${result.report_file}`);
    } catch (err: any) {
      toast.error(err.message || 'Error al generar reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (type: string) => {
    toast.info(`Descargando reporte: ${type}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm">Análisis y estadísticas del estacionamiento</p>
        </div>
        <Button onClick={handleGenerateMonthlyReport} disabled={isGenerating} className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/25">
          <FileText className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generando...' : 'Generar reporte mensual'}
        </Button>
      </div>

      {/* Key Metrics with trends */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total vehículos',
            value: vehicles.length,
            icon: TrendingUp,
            gradient: 'from-emerald-500 to-emerald-600',
            shadowColor: 'shadow-emerald-500/20',
            trend: '+18%',
            trendUp: true,
            trendLabel: 'vs mes anterior',
          },
          {
            label: 'Total registros',
            value: registers.length,
            icon: BarChart3,
            gradient: 'from-indigo-500 to-indigo-600',
            shadowColor: 'shadow-indigo-500/20',
            trend: '+24%',
            trendUp: true,
            trendLabel: 'vs mes anterior',
          },
          {
            label: 'Tiempo promedio',
            value: `${(avgMinutes / 60).toFixed(1)}h`,
            icon: Calendar,
            gradient: 'from-violet-500 to-purple-600',
            shadowColor: 'shadow-violet-500/20',
            trend: '-12%',
            trendUp: false,
            trendLabel: 'vs mes anterior',
          },
          {
            label: 'Completados',
            value: completedRegisters.length,
            icon: TrendingUp,
            gradient: 'from-amber-500 to-amber-600',
            shadowColor: 'shadow-amber-500/20',
            trend: '+8%',
            trendUp: true,
            trendLabel: 'vs mes anterior',
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{metric.label}</p>
                    {isLoading ? <Skeleton className="h-8 w-16" /> : (
                      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 border-0 font-semibold ${
                          metric.trendUp
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {metric.trendUp ? (
                          <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                        )}
                        {metric.trend}
                      </Badge>
                      <span className="text-[10px] text-slate-400">{metric.trendLabel}</span>
                    </div>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${metric.gradient} rounded-xl shadow-lg ${metric.shadowColor}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1: Monthly Revenue + Vehicle Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BarChart - Ingresos mensuales */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Ingresos mensuales</CardTitle>
            <CardDescription>Últimos 6 meses (estimado)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ingresos']}
                />
                <Bar dataKey="ingresos" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PieChart - Distribución de vehículos (datos reales) */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Distribución por tipo</CardTitle>
            <CardDescription>Desglose de vehículos por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[280px]">
                <Skeleton className="h-48 w-48 rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={vehicleDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {vehicleDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Legend */}
            {!isLoading && (
              <div className="flex items-center justify-center gap-6 mt-2">
                {vehicleDistributionData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                    <span className="text-xs text-slate-600">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Vehicles per month + Daily occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LineChart - Vehículos por mes */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Vehículos por mes</CardTitle>
            <CardDescription>Tendencia de registros mensuales</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={vehiclesPerMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="vehiculos"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BarChart - Ocupación diaria por hora */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Ocupación diaria</CardTitle>
            <CardDescription>Porcentaje de ocupación por hora</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hora" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}%`, 'Ocupación']}
                />
                <Bar dataKey="ocupacion" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle distribution detail (bars) + Register stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Detalle por tipo</CardTitle>
            <CardDescription>Distribución con barras de progreso</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {[
                  { label: 'Residentes', count: residentCount, icon: Car, color: 'bg-indigo-500', bgLight: 'bg-indigo-100', textColor: 'text-indigo-600' },
                  { label: 'No Residentes', count: nonResidentCount, icon: Bike, color: 'bg-violet-500', bgLight: 'bg-violet-100', textColor: 'text-violet-600' },
                  { label: 'Oficiales', count: oficialCount, icon: Truck, color: 'bg-amber-500', bgLight: 'bg-amber-100', textColor: 'text-amber-600' },
                ].map((item) => {
                  const percent = vehicles.length > 0 ? Math.round((item.count / vehicles.length) * 100) : 0;
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${item.bgLight}`}>
                        <Icon className={`w-5 h-5 ${item.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-700">{item.label}</span>
                          <span className="text-sm font-bold text-slate-900">{item.count} ({percent}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Register stats */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Resumen de registros</CardTitle>
            <CardDescription>Estadísticas de uso del estacionamiento</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-xl">
                  <p className="text-sm text-indigo-600 font-medium">Total registros</p>
                  <p className="text-2xl font-bold text-indigo-900">{registers.length}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="text-sm text-emerald-600 font-medium">Activos ahora</p>
                  <p className="text-2xl font-bold text-emerald-900">{registers.filter(r => !r.exitdate).length}</p>
                </div>
                <div className="p-4 bg-violet-50 rounded-xl">
                  <p className="text-sm text-violet-600 font-medium">Completados</p>
                  <p className="text-2xl font-bold text-violet-900">{completedRegisters.length}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-600 font-medium">Minutos totales</p>
                  <p className="text-2xl font-bold text-amber-900">{totalMinutes.toLocaleString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Download reports section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Descargar reportes</CardTitle>
          <CardDescription>Genera y descarga reportes en formato PDF</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-indigo-50 hover:border-indigo-200"
              onClick={() => handleDownloadReport('Reporte mensual')}
            >
              <Download className="w-6 h-6 text-indigo-500" />
              <span className="font-semibold text-slate-700">Reporte mensual</span>
              <span className="text-xs text-slate-400">Resumen del mes actual</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-violet-50 hover:border-violet-200"
              onClick={() => handleDownloadReport('Vehículos residentes')}
            >
              <Download className="w-6 h-6 text-violet-500" />
              <span className="font-semibold text-slate-700">Vehículos residentes</span>
              <span className="text-xs text-slate-400">Listado completo</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-amber-50 hover:border-amber-200"
              onClick={() => handleDownloadReport('Ingresos detallados')}
            >
              <Download className="w-6 h-6 text-amber-500" />
              <span className="font-semibold text-slate-700">Ingresos detallados</span>
              <span className="text-xs text-slate-400">Desglose de pagos</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last generated report */}
      {lastReport && (
        <Card className="border-0 shadow-sm border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">Último reporte generado</p>
                <p className="text-sm text-slate-500">{lastReport}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
