import { apiClient } from './apiClient';

const BASE = '/api/v1/parking/reports';

export const reportService = {
  async generateMonthly(): Promise<{ message: string; report_file: string }> {
    return apiClient.get(`${BASE}/monthly`);
  },
};
