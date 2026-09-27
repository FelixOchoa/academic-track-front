export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}
