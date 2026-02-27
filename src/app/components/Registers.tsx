import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Clock, Car, Bike, Truck, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

type VehicleType = 'CAR' | 'MOTORCYCLE' | 'OFFICIAL';

interface Register {
  id: number;
  vehicle: {
    id: string;
    type: VehicleType;
  };
  entryDate: string;
  exitDate: string | null;
  minutes: number;
}

export function Registers() {
  const [registers, setRegisters] = useState<Register[]>([
    {
      id: 1,
      vehicle: { id: 'ABC-123', type: 'CAR' },
      entryDate: '26-02-2026 08:30:00',
      exitDate: '26-02-2026 17:45:00',
      minutes: 555,
    },
    {
      id: 2,
      vehicle: { id: 'XYZ-789', type: 'MOTORCYCLE' },
      entryDate: '26-02-2026 09:15:00',
      exitDate: null,
      minutes: 0,
    },
    {
      id: 3,
      vehicle: { id: 'DEF-456', type: 'CAR' },
      entryDate: '26-02-2026 10:00:00',
      exitDate: null,
      minutes: 0,
    },
    {
      id: 4,
      vehicle: { id: 'GHI-321', type: 'OFFICIAL' },
      entryDate: '25-02-2026 14:20:00',
      exitDate: '25-02-2026 18:30:00',
      minutes: 250,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState('');
  const [selectedType, setSelectedType] = useState<VehicleType>('CAR');

  const activeRegisters = registers.filter((r) => !r.exitDate);
  const filteredRegisters = registers.filter((r) =>
    r.vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterEntry = () => {
    if (!selectedPlate) {
      toast.error('Por favor ingresa una placa');
      return;
    }

    const existingActive = registers.find(
      (r) => r.vehicle.id === selectedPlate && !r.exitDate
    );

    if (existingActive) {
      toast.error('Este vehículo ya tiene un registro activo');
      return;
    }

    const newRegister: Register = {
      id: Date.now(),
      vehicle: { id: selectedPlate, type: selectedType },
      entryDate: new Date().toLocaleString('es-CO', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      exitDate: null,
      minutes: 0,
    };

    setRegisters([newRegister, ...registers]);
    toast.success('Entrada registrada exitosamente');
    setIsEntryDialogOpen(false);
    setSelectedPlate('');
    setSelectedType('CAR');
  };

  const handleRegisterExit = () => {
    if (!selectedPlate) {
      toast.error('Por favor ingresa una placa');
      return;
    }

    const registerToUpdate = registers.find(
      (r) => r.vehicle.id === selectedPlate && !r.exitDate
    );

    if (!registerToUpdate) {
      toast.error('No se encontró un registro activo para este vehículo');
      return;
    }

    const exitDate = new Date();
    const entryDate = new Date(registerToUpdate.entryDate.split(' ')[0].split('-').reverse().join('-') + ' ' + registerToUpdate.entryDate.split(' ')[1]);
    const minutes = Math.floor((exitDate.getTime() - entryDate.getTime()) / 60000);

    const updatedRegisters = registers.map((r) =>
      r.id === registerToUpdate.id
        ? {
            ...r,
            exitDate: exitDate.toLocaleString('es-CO', { 
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }),
            minutes,
          }
        : r
    );

    setRegisters(updatedRegisters);
    toast.success('Salida registrada exitosamente');
    setIsExitDialogOpen(false);
    setSelectedPlate('');
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'CAR':
        return <Car className="w-4 h-4" />;
      case 'MOTORCYCLE':
        return <Bike className="w-4 h-4" />;
      case 'OFFICIAL':
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
                      <SelectItem value="CAR">Automóvil</SelectItem>
                      <SelectItem value="MOTORCYCLE">Motocicleta</SelectItem>
                      <SelectItem value="OFFICIAL">Oficial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleRegisterEntry} className="w-full">
                  Registrar entrada
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
                <Button onClick={handleRegisterExit} className="w-full">
                  Registrar salida
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
                <p className="text-2xl font-bold text-slate-900">{registers.length}</p>
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
                <p className="text-2xl font-bold text-slate-900">{activeRegisters.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Completados hoy</p>
                <p className="text-2xl font-bold text-slate-900">
                  {registers.filter((r) => r.exitDate).length}
                </p>
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
                  <TableHead className="text-slate-500">Entrada</TableHead>
                  <TableHead className="text-slate-500">Salida</TableHead>
                  <TableHead className="text-slate-500">Duración</TableHead>
                  <TableHead className="text-slate-500">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegisters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-400 py-12">
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
                      <TableCell className="text-slate-600 text-sm">{register.entryDate}</TableCell>
                      <TableCell className="text-slate-600 text-sm">{register.exitDate || '-'}</TableCell>
                      <TableCell className="text-slate-600 text-sm">{formatMinutes(register.minutes)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={register.exitDate ? 'bg-slate-50 text-slate-500 border-0' : 'bg-emerald-50 text-emerald-600 border-0'}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${register.exitDate ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`} />
                          {register.exitDate ? 'Completado' : 'Activo'}
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
