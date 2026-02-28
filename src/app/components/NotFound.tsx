import { Link } from 'react-router';
import { Car, Home } from 'lucide-react';
import { Button } from './ui/button';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/25">
          <Car className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-xl text-slate-600 mb-2">Página no encontrada</p>
        <p className="text-slate-400 mb-8">La página que buscas no existe o fue movida.</p>
        <Link to="/app">
          <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/25">
            <Home className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
