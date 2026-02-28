import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { vehicleService } from '../services/vehicleService';
import { paymentService } from '../services/paymentService';
import { StripeProvider } from './StripeProvider';
import type { VehicleType } from '../types/api';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1e293b',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#ef4444' },
  },
};

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const [plate, setPlate] = useState('');
  const [plateType, setPlateType] = useState<VehicleType>('RESIDENT');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const handleCalculate = async () => {
    if (!plate) {
      toast.error('Por favor ingresa una placa');
      return;
    }

    setIsProcessing(true);
    try {
      const price = await vehicleService.calculatePayment({ id: plate, type: plateType });
      setCalculatedPrice(price);
      toast.success('Pago calculado exitosamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al calcular pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePay = async () => {
    if (!stripe || !elements) {
      toast.error('Stripe no está listo aún');
      return;
    }

    if (calculatedPrice === null || calculatedPrice <= 0) {
      toast.error('Primero calcula el monto a pagar');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Error al obtener el elemento de tarjeta');
      return;
    }

    setIsProcessing(true);
    try {
      const amountInCents = Math.round(calculatedPrice * 100);

      const { clientSecret } = await paymentService.createPaymentIntent({
        amount: amountInCents,
        currency: 'USD',
        vehicleId: plate,
        description: `Pago estacionamiento - ${plate}`,
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        toast.error(error.message || 'Error al procesar el pago');
      } else if (paymentIntent?.status === 'succeeded') {
        toast.success('Pago procesado exitosamente');
        cardElement.clear();
        setPlate('');
        setCalculatedPrice(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al crear el intento de pago');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Paso 1: Placa y tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="plate">Placa del vehículo</Label>
          <Input
            id="plate"
            placeholder="ABC-123"
            value={plate}
            onChange={(e) => {
              setPlate(e.target.value.toUpperCase());
              setCalculatedPrice(null);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Tipo de vehículo</Label>
          <Select value={plateType} onValueChange={(v: VehicleType) => { setPlateType(v); setCalculatedPrice(null); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="RESIDENT">Residente</SelectItem>
              <SelectItem value="NON_RESIDENT">No Residente</SelectItem>
              <SelectItem value="OFICIAL">Oficial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        disabled={isProcessing || !plate}
        className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md shadow-indigo-500/20"
      >
        {isProcessing ? 'Calculando...' : 'Calcular pago'}
      </Button>

      {/* Paso 2: Monto y pago */}
      {calculatedPrice !== null && (
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl">
            <p className="text-sm text-emerald-700 mb-1 font-medium">Monto a pagar:</p>
            <p className="text-3xl font-bold text-emerald-800">${calculatedPrice.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <Label>Tarjeta de pago</Label>
            <div className="border rounded-lg p-3 bg-white">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <p className="text-xs text-slate-500">Usa 4242 4242 4242 4242 para pruebas</p>
          </div>

          <Button
            onClick={handlePay}
            disabled={isProcessing || !stripe}
            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-md shadow-emerald-500/20"
          >
            {isProcessing ? 'Procesando pago...' : `Pagar $${calculatedPrice.toFixed(2)}`}
          </Button>
        </div>
      )}
    </div>
  );
}

export function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-slate-500 text-sm">Gestiona los pagos del estacionamiento</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Pago de estacionamiento</CardTitle>
          <CardDescription>Ingresa la placa del vehículo para calcular y procesar el pago</CardDescription>
        </CardHeader>
        <CardContent>
          <StripeProvider>
            <PaymentForm />
          </StripeProvider>
        </CardContent>
      </Card>
    </div>
  );
}
