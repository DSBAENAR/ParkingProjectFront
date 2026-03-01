import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import {
  Car,
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada exitosamente');
    navigate('/');
  };

  const allMenuItems = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN'] },
    { path: '/app/vehicles', icon: Car, label: 'Vehículos', roles: ['ADMIN', 'USER'] },
    { path: '/app/registers', icon: FileText, label: 'Registros', roles: ['ADMIN', 'USER'] },
    { path: '/app/payments', icon: CreditCard, label: 'Pagos', roles: ['ADMIN', 'USER'] },
    { path: '/app/users', icon: Users, label: 'Usuarios', roles: ['ADMIN'] },
    { path: '/app/reports', icon: BarChart3, label: 'Reportes', roles: ['ADMIN'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role || ''));

  const getPageTitle = () => {
    const current = menuItems.find(item => item.path === location.pathname);
    return current?.label || 'Dashboard';
  };

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 pt-6 pb-8">
        <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div className="ml-3">
          <span className="text-lg font-bold text-slate-900 tracking-tight">Parking Core</span>
          <span className="block text-[11px] text-indigo-500 font-medium -mt-0.5">Management System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 mb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Menú principal</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200
                ${isActive
                  ? 'bg-indigo-100'
                  : 'bg-transparent group-hover:bg-slate-50'
                }
              `}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 pb-4 mt-auto">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-indigo-100">
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cerrar sesión</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas cerrar sesión?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                Cerrar sesión
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[260px] lg:flex-col bg-white border-r border-slate-200/80">
        <SidebarContent />
      </aside>

      {/* Sidebar móvil */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-[260px] bg-white shadow-2xl z-50">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <SidebarContent onItemClick={() => setIsSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Contenido principal */}
      <div className="lg:pl-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden hover:bg-slate-100"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </Button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-slate-900">{getPageTitle()}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center ml-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="ml-2 text-sm font-medium text-slate-700">{user?.name || 'Usuario'}</span>
            </div>
          </div>
        </header>

        {/* Mobile title */}
        <div className="sm:hidden px-4 pt-4">
          <h2 className="text-xl font-bold text-slate-900">{getPageTitle()}</h2>
        </div>

        {/* Contenido de la página */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
