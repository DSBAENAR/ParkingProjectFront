import { useState, useEffect } from 'react';
import { Car, Clock, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CircleParking, Bike, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { vehicleService } from '../services/vehicleService';
import { registerService } from '../services/registerService';
import type { Vehicle, Register } from '../types/api';

const TOTAL_SLOTS = 40;

export function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const activeRegisters = registers.filter((r) => !r.exitdate);
  const completedRegisters = registers.filter((r) => r.exitdate);
  const totalMinutes = completedRegisters.reduce((sum, r) => sum + r.minutes, 0);
  const avgMinutes = completedRegisters.length > 0 ? Math.round(totalMinutes / completedRegisters.length) : 0;
  const avgHours = (avgMinutes / 60).toFixed(1);

  const occupiedSlots = activeRegisters.length;
  const freeSlots = Math.max(0, TOTAL_SLOTS - occupiedSlots);
  const occupancyPercent = Math.round((occupiedSlots / TOTAL_SLOTS) * 100);

  // Generate parking slot data
  const parkingSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
    number: i + 1,
    occupied: i < occupiedSlots,
    plate: i < activeRegisters.length ? activeRegisters[i].vehicle.id : undefined,
  }));

  const stats = [
    {
      title: 'Vehículos registrados',
      value: isLoading ? null : String(vehicles.length),
      icon: Car,
      gradient: 'from-indigo-500 to-indigo-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Vehículos activos',
      value: isLoading ? null : String(activeRegisters.length),
      icon: Activity,
      gradient: 'from-emerald-500 to-emerald-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Registros totales',
      value: isLoading ? null : String(registers.length),
      icon: DollarSign,
      gradient: 'from-violet-500 to-purple-600',
      trend: '+24%',
      trendUp: true,
    },
    {
      title: 'Tiempo promedio',
      value: isLoading ? null : `${avgHours}h`,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      trend: '-5%',
      trendUp: false,
    },
  ];

  // Recent activity from registers
  const recentActivities = registers.slice(0, 5).map((r) => ({
    plate: r.vehicle.id,
    type: r.exitdate ? 'Salida' : 'Entrada',
    vehicleType: r.vehicle.type,
    date: r.exitdate || r.entrydate,
    icon: r.vehicle.type === 'RESIDENT' ? Car : r.vehicle.type === 'NON_RESIDENT' ? Bike : Car,
  }));

  // Occupancy bar color
  const occupancyColor =
    occupancyPercent > 80
      ? 'from-red-500 to-red-600'
      : occupancyPercent > 50
        ? 'from-amber-500 to-amber-600'
        : 'from-emerald-500 to-emerald-600';

  const occupancyBg =
    occupancyPercent > 80
      ? 'text-red-600'
      : occupancyPercent > 50
        ? 'text-amber-600'
        : 'text-emerald-600';

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
                      stat.trendUp
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {stat.trendUp ? (
                      <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    )}
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                {stat.value === null ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Parking Map */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CircleParking className="w-5 h-5 text-indigo-500" />
                Mapa del Estacionamiento
              </CardTitle>
              <CardDescription className="mt-1">Vista en tiempo real de los espacios</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-slate-600">Ocupado ({occupiedSlots})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-slate-600">Libre ({freeSlots})</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
              {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {/* Occupancy bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">Ocupación</span>
                  <span className={`text-sm font-bold ${occupancyBg}`}>{occupancyPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${occupancyColor} rounded-full transition-all duration-700`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>

              {/* Slots grid */}
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                {parkingSlots.map((slot) => (
                  <div
                    key={slot.number}
                    className={`relative flex items-center justify-center h-12 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      slot.occupied
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={slot.occupied ? `Placa: ${slot.plate}` : `Espacio ${slot.number} libre`}
                  >
                    {slot.occupied ? (
                      <Car className="w-4 h-4" />
                    ) : (
                      <span>{slot.number}</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle type distribution */}
        <Card className="lg:col-span-1 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CircleParking className="w-5 h-5 text-indigo-500" />
                  Distribución
                </CardTitle>
                <CardDescription className="mt-1">Por tipo de vehículo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { label: 'Residentes', type: 'RESIDENT' as const, color: 'bg-indigo-500' },
                  { label: 'No Residentes', type: 'NON_RESIDENT' as const, color: 'bg-violet-500' },
                  { label: 'Oficiales', type: 'OFICIAL' as const, color: 'bg-amber-500' },
                ].map((item) => {
                  const count = vehicles.filter((v) => v.type === item.type).length;
                  const percent = vehicles.length > 0 ? Math.round((count / vehicles.length) * 100) : 0;
                  return (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <span className="text-sm font-semibold text-slate-900">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                No hay actividad reciente
              </div>
            ) : (
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
                      <span className="text-xs text-slate-400">{activity.date}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              {isLoading ? (
                <Skeleton className="h-10 w-20 bg-indigo-400/30" />
              ) : (
                <p className="text-3xl font-bold">{freeSlots}/{TOTAL_SLOTS}</p>
              )}
              <p className="text-xs text-indigo-200 mt-1">disponibles</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-200" />
                <p className="text-emerald-100 text-sm font-medium">Ocupación</p>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-20 bg-emerald-400/30" />
              ) : (
                <p className="text-3xl font-bold">{occupancyPercent}%</p>
              )}
              <p className="text-xs text-emerald-200 mt-1">del estacionamiento</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-violet-200" />
                <p className="text-violet-100 text-sm font-medium">Pagos hoy</p>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-20 bg-violet-400/30" />
              ) : (
                <p className="text-3xl font-bold">{completedRegisters.length}</p>
              )}
              <p className="text-xs text-violet-200 mt-1">registros cerrados</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
