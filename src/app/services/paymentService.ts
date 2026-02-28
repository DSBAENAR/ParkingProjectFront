import { apiClient } from './apiClient';
import type { PaymentIntentRequest, PaymentIntentResponse } from '../types/api';

export const paymentService = {
  createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    return apiClient.post<PaymentIntentResponse>('/api/payments/create-intent', request);
  },
};
