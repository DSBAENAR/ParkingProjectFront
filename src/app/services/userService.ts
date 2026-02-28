import { apiClient } from './apiClient';
import type { User, PageResponse } from '../types/api';

const BASE = '/api/v1/parking/users';

export const userService = {
  async getAll(): Promise<User[]> {
    const data = await apiClient.get<{ users: User[] }>(`${BASE}/`);
    return data.users;
  },

  async getPaginated(pageNumber: number, pageSize = 10): Promise<PageResponse<User>> {
    return apiClient.get<PageResponse<User>>(`${BASE}/pages?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },

  async findUser(params: { name?: string; username?: string; email?: string }): Promise<User> {
    const query = new URLSearchParams();
    if (params.name) query.set('name', params.name);
    if (params.username) query.set('username', params.username);
    if (params.email) query.set('email', params.email);
    const data = await apiClient.get<{ user: User }>(`${BASE}/user?${query.toString()}`);
    return data.user;
  },
};
