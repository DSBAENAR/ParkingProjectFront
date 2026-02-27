import { Car, Clock, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CircleParking, Bike, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router';
import { Badge } from './ui/badge';

export function Dashboard() {
  const stats = [
    {
      title: 'Vehículos registrados',
      value: '248',
      change: '+12%',
      trend: 'up',
      icon: Car,
      gradient: 'from-indigo-500 to-indigo-600',
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Vehículos activos',
      value: '32',
      change: '-5%',
      trend: 'down',
      icon: Activity,
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Ingresos del mes',
      value: '$12,450',
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
    {
      title: 'Tiempo promedio',
      value: '4.2h',
      change: '+8%',
      trend: 'up',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  const recentActivities = [
    { plate: 'ABC-123', type: 'Entrada', time: 'Hace 5 min', vehicleType: 'CAR', icon: Car },
    { plate: 'XYZ-789', type: 'Salida', time: 'Hace 12 min', vehicleType: 'MOTO', icon: Bike },
    { plate: 'DEF-456', type: 'Entrada', time: 'Hace 28 min', vehicleType: 'CAR', icon: Car },
    { plate: 'GHI-321', type: 'Salida', time: 'Hace 35 min', vehicleType: 'CAR', icon: Car },
    { plate: 'JKL-654', type: 'Entrada', time: 'Hace 42 min', vehicleType: 'CAR', icon: Car },
  ];

  // Parking lot visualization (true = occupied, false = available)
  const parkingSlots = [
    true, true, false, true, false, true, true, true, false, false,
    true, false, false, true, true, true, false, true, true, false,
    true, true, true, false, false, true, false, false, true, true,
    true, false, true, true, false, false, true, true, false, false,
  ];

  const occupiedCount = parkingSlots.filter(Boolean).length;
  const totalSlots = parkingSlots.length;
  const occupancyPercent = Math.round((occupiedCount / totalSlots) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-indigo-200 text-sm font-medium">Sistema activo</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Bienvenido al Panel de Control
          </h1>
          <p className="text-indigo-200 max-w-lg">
            Monitorea en tiempo real la ocupación, ingresos y actividad de tu estacionamiento.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs font-semibold border-0 ${
                      stat.trend === 'up' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parking lot visualization */}
        <Card className="lg:col-span-1 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CircleParking className="w-5 h-5 text-indigo-500" />
                  Mapa del parking
                </CardTitle>
                <CardDescription className="mt-1">Ocupación en tiempo real</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Occupancy bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Ocupación</span>
                <span className={`text-sm font-bold ${
                  occupancyPercent > 80 ? 'text-red-500' : occupancyPercent > 50 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {occupancyPercent}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    occupancyPercent > 80 ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                    occupancyPercent > 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                    'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  }`}
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
            </div>

            {/* Parking grid */}
            <div className="grid grid-cols-5 gap-1.5 mb-5">
              {parkingSlots.map((occupied, i) => (
                <div
                  key={i}
                  className={`
                    aspect-[1.5/1] rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-300
                    ${occupied 
                      ? 'bg-indigo-100 text-indigo-500 border border-indigo-200' 
                      : 'bg-emerald-50 text-emerald-500 border border-emerald-200 border-dashed'
                    }
                  `}
                >
                  {occupied ? <Car className="w-3.5 h-3.5" /> : <span>{String(i + 1).padStart(2, '0')}</span>}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-indigo-100 border border-indigo-200" />
                <span className="text-slate-500">Ocupado ({occupiedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200 border-dashed" />
                <span className="text-slate-500">Libre ({totalSlots - occupiedCount})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Actividad reciente</CardTitle>
                <CardDescription>Últimos movimientos de vehículos</CardDescription>
              </div>
              <Link to="/app/registers">
                <Button variant="outline" size="sm" className="text-xs">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const VehicleIcon = activity.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'Entrada' 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        <VehicleIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 text-sm">{activity.plate}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] px-1.5 py-0 border-0 ${
                              activity.type === 'Entrada' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'bg-indigo-50 text-indigo-600'
                            }`}
                          >
                            {activity.type === 'Entrada' ? (
                              <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
                            ) : (
                              <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />
                            )}
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">{activity.vehicleType}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Acceso directo a funciones principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/app/vehicles">
              <Button className="w-full justify-start bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md shadow-indigo-500/20" size="lg">
                <Car className="w-5 h-5 mr-3" />
                Registrar nuevo vehículo
              </Button>
            </Link>
            <Link to="/app/registers">
              <Button className="w-full justify-start" variant="outline" size="lg">
                <ArrowUpRight className="w-5 h-5 mr-3 text-emerald-500" />
                Registrar entrada
              </Button>
            </Link>
            <Link to="/app/registers">
              <Button className="w-full justify-start" variant="outline" size="lg">
                <ArrowDownRight className="w-5 h-5 mr-3 text-indigo-500" />
                Registrar salida
              </Button>
            </Link>
            <Link to="/app/payments">
              <Button className="w-full justify-start" variant="outline" size="lg">
                <DollarSign className="w-5 h-5 mr-3 text-violet-500" />
                Procesar pago
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Info cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <CircleParking className="w-5 h-5 text-indigo-200" />
                <p className="text-indigo-100 text-sm font-medium">Espacios</p>
              </div>
              <p className="text-3xl font-bold">
                {totalSlots - occupiedCount}
                <span className="text-lg text-indigo-200 font-normal"> / {totalSlots}</span>
              </p>
              <p className="text-xs text-indigo-200 mt-1">disponibles ahora</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-200" />
                <p className="text-emerald-100 text-sm font-medium">Ocupación</p>
              </div>
              <p className="text-3xl font-bold">{occupancyPercent}%</p>
              <p className="text-xs text-emerald-200 mt-1">promedio hoy</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-violet-200" />
                <p className="text-violet-100 text-sm font-medium">Pagos hoy</p>
              </div>
              <p className="text-3xl font-bold">156</p>
              <p className="text-xs text-violet-200 mt-1">procesados</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
