import { apiClient } from './apiClient';
import type { Register, RegisterEntryRequest, Vehicle } from '../types/api';

const BASE = '/api/v1/parking';

export const registerService = {
  async getAll(): Promise<Register[]> {
    const data = await apiClient.get<{ registers: Register[] }>(`${BASE}/registers`);
    return data.registers;
  },

  async registerEntry(request: RegisterEntryRequest): Promise<Register> {
    const data = await apiClient.post<{ register: Register; message: string }>(`${BASE}/register`, request);
    return data.register;
  },

  async registerExit(vehicle: Pick<Vehicle, 'id' | 'type'>): Promise<Register> {
    const data = await apiClient.post<{ register: Register; message: string }>(`${BASE}/leave`, vehicle);
    return data.register;
  },
};
