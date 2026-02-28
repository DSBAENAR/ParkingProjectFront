import { apiClient } from './apiClient';
import type { Vehicle, VehicleType } from '../types/api';

const BASE = '/api/v1/parking/vehicles';

export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    const data = await apiClient.get<{ vehicles: Vehicle[] }>(`${BASE}/`);
    return data.vehicles;
  },

  async create(vehicle: { id: string; type: VehicleType }): Promise<Vehicle> {
    const data = await apiClient.post<{ vehicle: Vehicle; message: string }>(`${BASE}/`, vehicle);
    return data.vehicle;
  },

  async update(id: string, vehicle: { type: VehicleType }): Promise<Vehicle> {
    const data = await apiClient.put<{ vehicle: Vehicle; message: string }>(`${BASE}/${id}`, vehicle);
    return data.vehicle;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },

  async calculatePayment(vehicle: { id: string; type: VehicleType }): Promise<number> {
    const data = await apiClient.post<{ price: number; vehicle: Vehicle }>(`${BASE}/pay`, vehicle);
    return data.price;
  },

  async startsMonth(): Promise<{ message: string; deletedCount: number }> {
    return apiClient.post(`${BASE}/startsMonth`);
  },
};
