import { User } from '@/types/auth';

export const TOKEN_KEY = 'academic_track_token';
export const USER_KEY = 'academic_track_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // 1. Intentar desde document.cookie
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + TOKEN_KEY + '=([^;]*)'));
  if (match && match[2]) {
    return decodeURIComponent(match[2]);
  }

  // 2. Intentar desde localStorage como respaldo
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, expirationHours: number = 24): void {
  if (typeof window === 'undefined') return;

  const maxAge = expirationHours * 60 * 60;
  // Guardar en cookie para que el middleware de Next.js en servidor pueda leerla
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;

  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function saveStoredUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
