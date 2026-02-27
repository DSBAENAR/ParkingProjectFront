import { useState } from 'react';
import { CreditCard, DollarSign, FileText, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export function Payments() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate payment form
  const [plate, setPlate] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  // Customer form
  const [customerData, setCustomerData] = useState({
    id: '',
    name: '',
    email: '',
    country: 'US',
    city: '',
    address: '',
  });

  // Card form
  const [cardData, setCardData] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    currency: 'USD',
  });

  // Invoice form
  const [invoiceData, setInvoiceData] = useState({
    customer: '',
    hours: '',
    price: '',
    currency: 'USD',
  });

  const handleCalculatePayment = () => {
    if (!plate) {
      toast.error('Por favor ingresa una placa');
      return;
    }

    setIsProcessing(true);
    // Simular llamada a la API
    setTimeout(() => {
      const mockPrice = Math.floor(Math.random() * 5000) + 1000; // Entre $10 y $50
      setCalculatedPrice(mockPrice / 100);
      setIsProcessing(false);
      toast.success('Pago calculado exitosamente');
    }, 1000);
  };

  const handleCreateCustomer = () => {
    if (!customerData.name || !customerData.email) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsProcessing(true);
    // Simular llamada a la API de Stripe
    setTimeout(() => {
      toast.success('Cliente creado exitosamente en Stripe');
      setIsProcessing(false);
      // Mock customer ID
      const mockCustomerId = 'cus_' + Math.random().toString(36).substring(7);
      toast.info(`ID del cliente: ${mockCustomerId}`);
    }, 1500);
  };

  const handleAddCard = () => {
    if (!cardData.number || !cardData.expMonth || !cardData.expYear || !cardData.cvc) {
      toast.error('Por favor completa todos los campos de la tarjeta');
      return;
    }

    setIsProcessing(true);
    // Simular llamada a la API de Stripe
    setTimeout(() => {
      toast.success('Tarjeta agregada exitosamente');
      setIsProcessing(false);
    }, 1500);
  };

  const handleCreateInvoice = () => {
    if (!invoiceData.customer || !invoiceData.hours || !invoiceData.price) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsProcessing(true);
    // Simular llamada a la API de Stripe
    setTimeout(() => {
      toast.success('Factura creada exitosamente');
      setIsProcessing(false);
      const mockInvoiceUrl = 'https://invoice.stripe.com/i/acct_xxx/test_xxx';
      toast.info('Factura disponible en el sistema');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-slate-500 text-sm">Gestiona los pagos y facturación con Stripe</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Ingresos hoy</p>
                <p className="text-2xl font-bold text-slate-900">$1,234</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Pagos procesados</p>
                <p className="text-2xl font-bold text-slate-900">156</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Clientes Stripe</p>
                <p className="text-2xl font-bold text-slate-900">89</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Facturas</p>
                <p className="text-2xl font-bold text-slate-900">145</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Forms */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Gestión de pagos</CardTitle>
          <CardDescription>Procesa pagos y gestiona clientes con Stripe</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculate" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calculate">Calcular</TabsTrigger>
              <TabsTrigger value="customer">Cliente</TabsTrigger>
              <TabsTrigger value="card">Tarjeta</TabsTrigger>
              <TabsTrigger value="invoice">Factura</TabsTrigger>
            </TabsList>

            {/* Calculate Payment Tab */}
            <TabsContent value="calculate" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="plate">Placa del vehículo</Label>
                <Input
                  id="plate"
                  placeholder="ABC-123"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                />
              </div>
              <Button onClick={handleCalculatePayment} disabled={isProcessing} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md shadow-indigo-500/20">
                {isProcessing ? 'Calculando...' : 'Calcular pago'}
              </Button>
              {calculatedPrice !== null && (
                <div className="p-5 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl">
                  <p className="text-sm text-emerald-700 mb-1 font-medium">Monto a pagar:</p>
                  <p className="text-3xl font-bold text-emerald-800">${calculatedPrice.toFixed(2)}</p>
                </div>
              )}
            </TabsContent>

            {/* Create Customer Tab */}
            <TabsContent value="customer" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-id">ID de usuario</Label>
                  <Input
                    id="customer-id"
                    placeholder="user123"
                    value={customerData.id}
                    onChange={(e) => setCustomerData({ ...customerData, id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Nombre completo</Label>
                  <Input
                    id="customer-name"
                    placeholder="Juan Pérez"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-country">País</Label>
                  <Select
                    value={customerData.country}
                    onValueChange={(value) => setCustomerData({ ...customerData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">Estados Unidos</SelectItem>
                      <SelectItem value="MX">México</SelectItem>
                      <SelectItem value="CO">Colombia</SelectItem>
                      <SelectItem value="ES">España</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-city">Ciudad</Label>
                  <Input
                    id="customer-city"
                    placeholder="Nueva York"
                    value={customerData.city}
                    onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-address">Dirección</Label>
                  <Input
                    id="customer-address"
                    placeholder="Calle Principal 123"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateCustomer} disabled={isProcessing} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600">
                {isProcessing ? 'Creando cliente...' : 'Crear cliente en Stripe'}
              </Button>
            </TabsContent>

            {/* Add Card Tab */}
            <TabsContent value="card" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="card-number">Número de tarjeta</Label>
                  <Input
                    id="card-number"
                    placeholder="4242 4242 4242 4242"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Usa 4242 4242 4242 4242 para pruebas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-exp-month">Mes de expiración</Label>
                  <Input
                    id="card-exp-month"
                    placeholder="12"
                    value={cardData.expMonth}
                    onChange={(e) => setCardData({ ...cardData, expMonth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-exp-year">Año de expiración</Label>
                  <Input
                    id="card-exp-year"
                    placeholder="2026"
                    value={cardData.expYear}
                    onChange={(e) => setCardData({ ...cardData, expYear: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input
                    id="card-cvc"
                    placeholder="123"
                    value={cardData.cvc}
                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-currency">Moneda</Label>
                  <Select
                    value={cardData.currency}
                    onValueChange={(value) => setCardData({ ...cardData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                      <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddCard} disabled={isProcessing} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600">
                {isProcessing ? 'Agregando tarjeta...' : 'Agregar tarjeta'}
              </Button>
            </TabsContent>

            {/* Create Invoice Tab */}
            <TabsContent value="invoice" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-customer">ID del cliente (Stripe)</Label>
                  <Input
                    id="invoice-customer"
                    placeholder="cus_ABC123XYZ"
                    value={invoiceData.customer}
                    onChange={(e) => setInvoiceData({ ...invoiceData, customer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-currency">Moneda</Label>
                  <Select
                    value={invoiceData.currency}
                    onValueChange={(value) => setInvoiceData({ ...invoiceData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                      <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-hours">Horas de estacionamiento</Label>
                  <Input
                    id="invoice-hours"
                    type="number"
                    placeholder="5"
                    value={invoiceData.hours}
                    onChange={(e) => setInvoiceData({ ...invoiceData, hours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-price">Precio (en centavos)</Label>
                  <Input
                    id="invoice-price"
                    type="number"
                    placeholder="2500"
                    value={invoiceData.price}
                    onChange={(e) => setInvoiceData({ ...invoiceData, price: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">2500 = $25.00</p>
                </div>
              </div>
              <Button onClick={handleCreateInvoice} disabled={isProcessing} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600">
                {isProcessing ? 'Creando factura...' : 'Crear factura'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
