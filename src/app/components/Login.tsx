import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Car, LogIn, UserPlus, Shield, Zap, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login, signUp, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una mayúscula';
    if (!/\d/.test(password)) return 'La contraseña debe contener al menos un número';
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ username: loginData.username, password: loginData.password });
      toast.success('Inicio de sesión exitoso');
      navigate('/app');
    } catch (err: any) {
      toast.error(err.message || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(signupData.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await signUp({
        name: signupData.name,
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
      });
      toast.success('Cuenta creada exitosamente');
      navigate('/app');
    } catch (err: any) {
      toast.error(err.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center mb-12">
            <div className="flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <Car className="w-8 h-8 text-white" />
            </div>
            <span className="ml-4 text-3xl font-bold text-white tracking-tight">Parking Core</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Gestión inteligente de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200">
              estacionamientos
            </span>
          </h2>
          <p className="text-indigo-200 text-lg mb-12 max-w-md leading-relaxed">
            Controla entradas, salidas, pagos y reportes desde una plataforma unificada y moderna.
          </p>

          <div className="space-y-4">
            {[
              { icon: Zap, title: 'Tiempo real', desc: 'Monitoreo en vivo de ocupación' },
              { icon: Shield, title: 'Seguro', desc: 'Datos protegidos y encriptados' },
              { icon: Clock, title: 'Eficiente', desc: 'Procesa pagos en segundos' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 max-w-sm hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg">
                  <feature.icon className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{feature.title}</p>
                  <p className="text-indigo-300 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/25">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Parking Core</h1>
            <p className="text-slate-500">Sistema de gestión de estacionamiento</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido</h1>
            <p className="text-slate-500">Inicia sesión para acceder al panel de control</p>
          </div>

          <Card className="shadow-xl shadow-slate-200/50 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100/80">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Iniciar sesión
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Registrarse
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-username" className="text-slate-700">Usuario o Email</Label>
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="usuario@ejemplo.com"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                        className="h-12 bg-slate-50/50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-slate-700">Contraseña</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="h-12 bg-slate-50/50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 text-base font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Iniciando sesión...
                        </span>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Iniciar sesión
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-slate-700">Nombre completo</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        required
                        className="h-11 bg-slate-50/50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-username" className="text-slate-700">Usuario</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="juanperez"
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                        required
                        className="h-11 bg-slate-50/50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-slate-700">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="juan@ejemplo.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                        className="h-11 bg-slate-50/50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-slate-700">Contraseña</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        className="h-11 bg-slate-50/50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                      />
                      <p className="text-xs text-slate-400">Mínimo 8 caracteres, 1 mayúscula, 1 número</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="text-slate-700">Confirmar contraseña</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                        className="h-11 bg-slate-50/50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 text-base font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creando cuenta...
                        </span>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Crear cuenta
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-slate-400 mt-6">
            &copy; 2026 Parking Core. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
