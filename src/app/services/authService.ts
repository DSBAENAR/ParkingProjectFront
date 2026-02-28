import { apiClient } from './apiClient';
import type { AuthRequest, AuthResponse } from '../types/api';

const BASE = '/api/v1/parking/auth';

export const authService = {
  async login(credentials: { username: string; password: string }): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${BASE}/login`, credentials);
  },

  async signUp(data: AuthRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${BASE}/signUp`, data);
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (token) {
      await apiClient.post(`${BASE}/logout`).catch(() => {});
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};
