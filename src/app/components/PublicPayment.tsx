import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Car, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { publicPaymentService, type PublicPaymentDetails } from '../services/publicPaymentService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm({ details }: { details: PublicPaymentDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { clientSecret } = await publicPaymentService.createPaymentIntent(
        String(details.registerId)
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setErrorMessage(error.message || 'Error al procesar el pago');
        setPaymentStatus('error');
      } else if (paymentIntent?.status === 'succeeded') {
        setPaymentStatus('success');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al procesar el pago');
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pago exitoso</h2>
        <p className="text-slate-500">
          El pago de ${details.amount.toFixed(2)} para el vehículo {details.plate} ha sido procesado correctamente.
        </p>
      </div>
    );
  }

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-500 mb-1">Vehículo</p>
          <p className="text-lg font-bold text-slate-900">{details.plate}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-500 mb-1">Tipo</p>
          <Badge variant="outline">{details.vehicleType}</Badge>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-500 mb-1">Duración</p>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <p className="text-lg font-bold text-slate-900">{formatMinutes(details.minutes)}</p>
          </div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-600 mb-1">Total a pagar</p>
          <p className="text-2xl font-bold text-emerald-700">${details.amount.toFixed(2)}</p>
        </div>
      </div>

      <div className="text-sm text-slate-500 space-y-1">
        <p>Entrada: {details.entryDate}</p>
        <p>Salida: {details.exitDate}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Datos de la tarjeta</label>
        <div className="p-3 border border-slate-200 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#334155',
                  '::placeholder': { color: '#94a3b8' },
                },
              },
            }}
          />
        </div>
      </div>

      {paymentStatus === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
      >
        {isProcessing ? 'Procesando...' : `Pagar $${details.amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

export function PublicPayment() {
  const { registerId } = useParams<{ registerId: string }>();
  const [details, setDetails] = useState<PublicPaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!registerId) return;
    setIsLoading(true);
    publicPaymentService
      .getPaymentDetails(registerId)
      .then(setDetails)
      .catch((err: any) => setError(err.message || 'Error al cargar los datos del pago'))
      .finally(() => setIsLoading(false));
  }, [registerId]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 mx-auto mb-3">
            <Car className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl">Parking Core - Pago</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-slate-600">{error}</p>
            </div>
          ) : details ? (
            <Elements stripe={stripePromise}>
              <PaymentForm details={details} />
            </Elements>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
