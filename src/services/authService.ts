import { http } from '@/api/http';
import { AuthResponse, LoginCredentials, User } from '@/types/auth';
import { setToken, removeToken, saveStoredUser } from '@/lib/auth-token';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/api/auth/login', credentials);
    if (response?.token) {
      setToken(response.token);
      if (response.user) {
        saveStoredUser(response.user);
      }
    }
    return response;
  },

  async getCurrentUser(): Promise<User> {
    const user = await http.get<User>('/api/auth/me');
    if (user) {
      saveStoredUser(user);
    }
    return user;
  },

  logout(): void {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};
