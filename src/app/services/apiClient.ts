const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (err) {
      throw {
        status: 0,
        message: 'No se pudo conectar al servidor. Verifica tu conexión a internet o intenta más tarde.',
      };
    }

    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
      throw { status: 401, message: 'Tu sesión ha expirado. Inicia sesión nuevamente.' };
    }

    if (response.status === 403) {
      throw { status: 403, message: 'No tienes permisos para realizar esta acción.' };
    }

    if (response.status === 404) {
      throw { status: 404, message: 'El recurso solicitado no fue encontrado.' };
    }

    if (response.status >= 500) {
      throw { status: response.status, message: 'Error interno del servidor. Intenta más tarde.' };
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: response.statusText }));
      throw { status: response.status, message: errorBody.message || response.statusText };
    }

    return response.json();
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
