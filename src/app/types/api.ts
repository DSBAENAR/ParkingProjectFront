export type VehicleType = 'OFICIAL' | 'RESIDENT' | 'NON_RESIDENT';

export interface Vehicle {
  id: string;
  type: VehicleType;
}

export interface Register {
  id: number;
  vehicle: Vehicle;
  entrydate: string;
  exitdate: string | null;
  minutes: number;
}

export interface User {
  name: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthRequest {
  name?: string;
  username: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  user: {
    name: string;
    email: string;
    username: string;
  };
  token: string;
  message: string;
}

export interface PageResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export interface ApiError {
  status: number;
  message: string;
}
