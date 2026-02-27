import { useState } from 'react';
import { Users as UsersIcon, Search, Shield, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

interface User {
  name: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export function Users() {
  const [users] = useState<User[]>([
    {
      name: 'Admin Principal',
      username: 'admin',
      email: 'admin@parking.com',
      role: 'ADMIN',
    },
    {
      name: 'Juan Pérez',
      username: 'jperez',
      email: 'juan.perez@ejemplo.com',
      role: 'USER',
    },
    {
      name: 'María García',
      username: 'mgarcia',
      email: 'maria.garcia@ejemplo.com',
      role: 'USER',
    },
    {
      name: 'Carlos López',
      username: 'clopez',
      email: 'carlos.lopez@ejemplo.com',
      role: 'USER',
    },
    {
      name: 'Ana Martínez',
      username: 'amartinez',
      email: 'ana.martinez@ejemplo.com',
      role: 'USER',
    },
    {
      name: 'Roberto Silva',
      username: 'rsilva',
      email: 'roberto.silva@ejemplo.com',
      role: 'ADMIN',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const userCount = users.filter((u) => u.role === 'USER').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-slate-500 text-sm">Gestiona los usuarios del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total usuarios</p>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Administradores</p>
                <p className="text-2xl font-bold text-slate-900">{adminCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Usuarios regulares</p>
                <p className="text-2xl font-bold text-slate-900">{userCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Lista de usuarios</CardTitle>
          <CardDescription>Usuarios registrados en el sistema</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar usuarios..."
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
                  <TableHead className="text-slate-500">Usuario</TableHead>
                  <TableHead className="text-slate-500">Nombre de usuario</TableHead>
                  <TableHead className="text-slate-500">Email</TableHead>
                  <TableHead className="text-slate-500">Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-400 py-12">
                      <UsersIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.username} className="border-slate-50 hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-slate-900">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-500">@{user.username}</span>
                      </TableCell>
                      <TableCell className="text-slate-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={user.role === 'ADMIN' ? 'bg-violet-50 text-violet-600 border-0' : 'bg-slate-50 text-slate-500 border-0'}>
                          {user.role === 'ADMIN' ? (
                            <div className="flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              Administrador
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <UserIcon className="w-3 h-3 mr-1" />
                              Usuario
                            </div>
                          )}
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
