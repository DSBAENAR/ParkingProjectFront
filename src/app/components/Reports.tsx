import { useState } from 'react';
import { BarChart3, FileText, Download, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function Reports() {
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data para gráficos
  const monthlyData = [
    { month: 'Ene', ingresos: 15000, vehiculos: 320 },
    { month: 'Feb', ingresos: 18000, vehiculos: 380 },
    { month: 'Mar', ingresos: 22000, vehiculos: 450 },
    { month: 'Abr', ingresos: 19000, vehiculos: 410 },
    { month: 'May', ingresos: 25000, vehiculos: 520 },
    { month: 'Jun', ingresos: 28000, vehiculos: 580 },
  ];

  const vehicleTypeData = [
    { name: 'Automóviles', value: 65, color: '#4f46e5' },
    { name: 'Motocicletas', value: 25, color: '#8b5cf6' },
    { name: 'Oficiales', value: 10, color: '#10b981' },
  ];

  const dailyOccupancy = [
    { hour: '00:00', ocupacion: 15 },
    { hour: '04:00', ocupacion: 8 },
    { hour: '08:00', ocupacion: 45 },
    { hour: '12:00', ocupacion: 72 },
    { hour: '16:00', ocupacion: 68 },
    { hour: '20:00', ocupacion: 42 },
    { hour: '23:00', ocupacion: 28 },
  ];

  const handleGenerateMonthlyReport = () => {
    setIsGenerating(true);
    // Simular generación de reporte
    setTimeout(() => {
      toast.success('Reporte mensual generado exitosamente');
      toast.info('El archivo se ha guardado en el servidor');
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownloadReport = (type: string) => {
    toast.success(`Descargando reporte ${type}...`);
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Ingresos totales</p>
                <p className="text-2xl font-bold text-slate-900">$127,000</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">+15.3% vs mes anterior</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Vehículos totales</p>
                <p className="text-2xl font-bold text-slate-900">2,660</p>
                <p className="text-xs text-indigo-600 mt-1 font-medium">+8.2% vs mes anterior</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Tiempo promedio</p>
                <p className="text-2xl font-bold text-slate-900">4.2h</p>
                <p className="text-xs text-violet-600 mt-1 font-medium">+0.5h vs mes anterior</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Ocupación promedio</p>
                <p className="text-2xl font-bold text-slate-900">68%</p>
                <p className="text-xs text-amber-600 mt-1 font-medium">+3.1% vs mes anterior</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Ingresos mensuales</CardTitle>
            <CardDescription>Evolución de ingresos en los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(value: any) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="ingresos" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Types Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Distribución por tipo de vehículo</CardTitle>
            <CardDescription>Porcentaje de vehículos por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.value}%`}
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value}%`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {vehicleTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-500">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Vehicles Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Vehículos por mes</CardTitle>
            <CardDescription>Número de vehículos registrados mensualmente</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line
                  type="monotone"
                  dataKey="vehiculos"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Occupancy Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Ocupación diaria</CardTitle>
            <CardDescription>Porcentaje de ocupación por hora del día</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyOccupancy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(value: any) => `${value}%`}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="ocupacion" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Download Reports */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Descargar reportes</CardTitle>
          <CardDescription>Exporta reportes en diferentes formatos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              onClick={() => handleDownloadReport('mensual')}
            >
              <Download className="w-4 h-4 mr-2" />
              Reporte mensual (.txt)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              onClick={() => handleDownloadReport('vehículos')}
            >
              <Download className="w-4 h-4 mr-2" />
              Vehículos residentes
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              onClick={() => handleDownloadReport('ingresos')}
            >
              <Download className="w-4 h-4 mr-2" />
              Ingresos detallados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
