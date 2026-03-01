import { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, Clock, Car, Bike, Truck, Search, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import { registerService } from '../services/registerService';
import type { Register, VehicleType } from '../types/api';

export function Registers() {
  const [registers, setRegisters] = useState<Register[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState('');
  const [selectedType, setSelectedType] = useState<VehicleType>('RESIDENT');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const data = await registerService.getAll();
      setRegisters(data);
    } catch (err: any) {
      if (err.status !== 404) toast.error(err.message || 'Error al cargar registros');
      setRegisters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeRegisters = registers.filter((r) => !r.exitdate);
  const filteredRegisters = registers.filter((r) =>
    r.vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterEntry = async () => {
    if (!selectedPlate) {
      toast.error('Por favor ingresa una placa');
      return;
    }

    setIsSubmitting(true);
    try {
      const newRegister = await registerService.registerEntry({
        vehicleId: selectedPlate,
        vehicleType: selectedType,
        phoneNumber: phoneNumber || undefined,
      });
      setRegisters([newRegister, ...registers]);
      toast.success('Entrada registrada exitosamente');
      setIsEntryDialogOpen(false);
      setSelectedPlate('');
      setSelectedType('RESIDENT');
      setPhoneNumber('');
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar entrada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterExit = async () => {
    if (!selectedPlate) {
      toast.error('Por favor ingresa una placa');
      return;
    }

    const activeReg = registers.find((r) => r.vehicle.id === selectedPlate && !r.exitdate);
    if (!activeReg) {
      toast.error('No se encontró un registro activo para este vehículo');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await registerService.registerExit({ id: selectedPlate, type: activeReg.vehicle.type });
      setRegisters(registers.map((r) => (r.id === activeReg.id ? updated : r)));
      toast.success('Salida registrada exitosamente');
      setIsExitDialogOpen(false);
      setSelectedPlate('');
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar salida');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'RESIDENT':
        return <Car className="w-4 h-4" />;
      case 'NON_RESIDENT':
        return <Bike className="w-4 h-4" />;
      case 'OFICIAL':
        return <Truck className="w-4 h-4" />;
    }
  };

  const formatMinutes = (minutes: number) => {
    if (minutes === 0) return 'En curso';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm">Gestiona las entradas y salidas de vehículos</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-md shadow-emerald-500/20">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Registrar entrada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar entrada</DialogTitle>
                <DialogDescription>
                  Registra la entrada de un vehículo al estacionamiento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="entry-plate">Placa</Label>
                  <Input
                    id="entry-plate"
                    placeholder="ABC-123"
                    value={selectedPlate}
                    onChange={(e) => setSelectedPlate(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry-type">Tipo de vehículo</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value: VehicleType) => setSelectedType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RESIDENT">Residente</SelectItem>
                      <SelectItem value="NON_RESIDENT">No Residente</SelectItem>
                      <SelectItem value="OFICIAL">Oficial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry-phone">Teléfono (opcional)</Label>
                  <Input
                    id="entry-phone"
                    placeholder="+573001234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={handleRegisterEntry} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Registrando...' : 'Registrar entrada'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <ArrowDownRight className="w-4 h-4 mr-2" />
                Registrar salida
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar salida</DialogTitle>
                <DialogDescription>
                  Registra la salida de un vehículo del estacionamiento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="exit-plate">Placa</Label>
                  <Input
                    id="exit-plate"
                    placeholder="ABC-123"
                    value={selectedPlate}
                    onChange={(e) => setSelectedPlate(e.target.value.toUpperCase())}
                  />
                </div>
                {activeRegisters.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900 font-medium mb-2">Vehículos activos:</p>
                    <div className="space-y-1">
                      {activeRegisters.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedPlate(r.vehicle.id)}
                          className="text-sm text-blue-700 hover:underline block"
                        >
                          {r.vehicle.id}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Button onClick={handleRegisterExit} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Registrando...' : 'Registrar salida'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total registros</p>
                {isLoading ? <Skeleton className="h-8 w-12" /> : (
                  <p className="text-2xl font-bold text-slate-900">{registers.length}</p>
                )}
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Vehículos activos</p>
                {isLoading ? <Skeleton className="h-8 w-12" /> : (
                  <p className="text-2xl font-bold text-slate-900">{activeRegisters.length}</p>
                )}
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Completados</p>
                {isLoading ? <Skeleton className="h-8 w-12" /> : (
                  <p className="text-2xl font-bold text-slate-900">
                    {registers.filter((r) => r.exitdate).length}
                  </p>
                )}
              </div>
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20">
                <ArrowDownRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Historial de registros</CardTitle>
          <CardDescription>Registro de entradas y salidas de vehículos</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar por placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50/50"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100">
                  <TableHead className="text-slate-500">Vehículo</TableHead>
                  <TableHead className="text-slate-500">Teléfono</TableHead>
                  <TableHead className="text-slate-500">Entrada</TableHead>
                  <TableHead className="text-slate-500">Salida</TableHead>
                  <TableHead className="text-slate-500">Duración</TableHead>
                  <TableHead className="text-slate-500">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredRegisters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegisters.map((register) => (
                    <TableRow key={register.id} className="border-slate-50 hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            {getVehicleIcon(register.vehicle.type)}
                          </div>
                          <span className="font-semibold text-slate-900">{register.vehicle.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {register.phoneNumber ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {register.phoneNumber}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">{register.entrydate}</TableCell>
                      <TableCell className="text-slate-600 text-sm">{register.exitdate || '-'}</TableCell>
                      <TableCell className="text-slate-600 text-sm">{formatMinutes(register.minutes)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={register.exitdate ? 'bg-slate-50 text-slate-500 border-0' : 'bg-emerald-50 text-emerald-600 border-0'}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${register.exitdate ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`} />
                          {register.exitdate ? 'Completado' : 'Activo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
