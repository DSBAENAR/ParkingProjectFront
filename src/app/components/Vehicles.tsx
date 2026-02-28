import { useState, useEffect } from 'react';
import { Car, Bike, Truck, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, VehicleType } from '../types/api';

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null);
  const [editType, setEditType] = useState<VehicleType>('RESIDENT');
  const [newVehicle, setNewVehicle] = useState<{ id: string; type: VehicleType }>({
    id: '',
    type: 'RESIDENT',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err: any) {
      if (err.status !== 404) toast.error(err.message || 'Error al cargar vehículos');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVehicle = async () => {
    if (!newVehicle.id) {
      toast.error('Por favor ingresa una placa');
      return;
    }

    try {
      const saved = await vehicleService.create(newVehicle);
      setVehicles([...vehicles, saved]);
      toast.success('Vehículo registrado exitosamente');
      setIsDialogOpen(false);
      setNewVehicle({ id: '', type: 'RESIDENT' });
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar vehículo');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await vehicleService.delete(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
      toast.success('Vehículo eliminado exitosamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar vehículo');
    }
    setDeleteTarget(null);
  };

  const handleEditVehicle = async () => {
    if (!editTarget) return;
    try {
      const updated = await vehicleService.update(editTarget.id, { type: editType });
      setVehicles(vehicles.map((v) => (v.id === editTarget.id ? updated : v)));
      toast.success('Vehículo actualizado exitosamente');
      setIsEditDialogOpen(false);
      setEditTarget(null);
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar vehículo');
    }
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setEditTarget(vehicle);
    setEditType(vehicle.type);
    setIsEditDialogOpen(true);
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

  const getVehicleTypeLabel = (type: VehicleType) => {
    switch (type) {
      case 'RESIDENT':
        return 'Residente';
      case 'NON_RESIDENT':
        return 'No Residente';
      case 'OFICIAL':
        return 'Oficial';
    }
  };

  const getVehicleTypeBadge = (type: VehicleType) => {
    switch (type) {
      case 'RESIDENT':
        return 'bg-indigo-50 text-indigo-600 border-0';
      case 'NON_RESIDENT':
        return 'bg-violet-50 text-violet-600 border-0';
      case 'OFICIAL':
        return 'bg-amber-50 text-amber-600 border-0';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm">Gestiona los vehículos registrados en el sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md shadow-indigo-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo vehículo
            </Button>
          </DialogTrigger>
          <DialogContent className="border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle>Registrar nuevo vehículo</DialogTitle>
              <DialogDescription>
                Ingresa los datos del vehículo para registrarlo en el sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="plate">Placa</Label>
                <Input
                  id="plate"
                  placeholder="ABC-123"
                  value={newVehicle.id}
                  onChange={(e) => setNewVehicle({ ...newVehicle, id: e.target.value.toUpperCase() })}
                  className="h-11 bg-slate-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de vehículo</Label>
                <Select
                  value={newVehicle.type}
                  onValueChange={(value: VehicleType) => setNewVehicle({ ...newVehicle, type: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESIDENT">Residente</SelectItem>
                    <SelectItem value="NON_RESIDENT">No Residente</SelectItem>
                    <SelectItem value="OFICIAL">Oficial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddVehicle} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600">
                Registrar vehículo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total vehículos</p>
                {isLoading ? <Skeleton className="h-8 w-12" /> : (
                  <p className="text-2xl font-bold text-slate-900">{vehicles.length}</p>
                )}
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <Car className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Residentes</p>
                {isLoading ? <Skeleton className="h-8 w-12" /> : (
                  <p className="text-2xl font-bold text-slate-900">
                    {vehicles.filter((v) => v.type === 'RESIDENT').length}
                  </p>
                )}
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <Car className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">No Residentes</p>
                {isLoading ? <Skeleton className="h-8 w-12" /> : (
                  <p className="text-2xl font-bold text-slate-900">
                    {vehicles.filter((v) => v.type === 'NON_RESIDENT').length}
                  </p>
                )}
              </div>
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20">
                <Bike className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Lista de vehículos</CardTitle>
          <CardDescription>Vehículos registrados en el sistema</CardDescription>
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
                  <TableHead className="text-slate-500">Placa</TableHead>
                  <TableHead className="text-slate-500">Tipo</TableHead>
                  <TableHead className="text-right text-slate-500">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-400 py-12">
                      <Car className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No se encontraron vehículos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="border-slate-50 hover:bg-slate-50/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            {getVehicleIcon(vehicle.type)}
                          </div>
                          <span className="font-semibold text-slate-900">{vehicle.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getVehicleTypeBadge(vehicle.type)}>
                          {getVehicleTypeLabel(vehicle.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={() => openEditDialog(vehicle)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                            onClick={() => setDeleteTarget(vehicle.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Editar vehículo</DialogTitle>
            <DialogDescription>
              Cambia el tipo de vehículo para {editTarget?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Tipo de vehículo</Label>
              <Select value={editType} onValueChange={(value: VehicleType) => setEditType(value)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESIDENT">Residente</SelectItem>
                  <SelectItem value="NON_RESIDENT">No Residente</SelectItem>
                  <SelectItem value="OFICIAL">Oficial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleEditVehicle} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600">
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar vehículo</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el vehículo {deleteTarget}? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDeleteVehicle(deleteTarget)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
