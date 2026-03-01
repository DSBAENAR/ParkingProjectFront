import { publicApiClient } from './publicApiClient';

const BASE = '/api/v1/public/pay';

export interface PublicPaymentDetails {
  registerId: number;
  plate: string;
  vehicleType: string;
  entryDate: string;
  exitDate: string;
  minutes: number;
  amount: number;
}

export interface PublicPaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const publicPaymentService = {
  async getPaymentDetails(registerId: string): Promise<PublicPaymentDetails> {
    return publicApiClient.get<PublicPaymentDetails>(`${BASE}/${registerId}`);
  },

  async createPaymentIntent(registerId: string): Promise<PublicPaymentIntentResponse> {
    return publicApiClient.post<PublicPaymentIntentResponse>(`${BASE}/${registerId}/create-intent`);
  },
};
