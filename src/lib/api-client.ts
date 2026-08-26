// Cliente HTTP minimalista para hablar con AcademicTrack.API.
// No se agrega axios a propósito: fetch nativo es suficiente y evita una
// dependencia nueva en el proyecto.

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';
  console.log('API_BASE_URL =', API_BASE_URL);

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    // El backend expuesto por Kestrel/Docker no usa cookies de sesión;
    // se deja explícito para no arrastrar credenciales por accidente.
    credentials: 'omit',
  });

  if (!res.ok) {
    // El middleware de excepciones del backend responde con
    // application/problem+json: { status, detail }
    let detail = `Error ${res.status} al comunicarse con el servidor.`;
    try {
      const problem = await res.json();
      if (problem?.detail) detail = problem.detail;
    } catch {
      // La respuesta no traía cuerpo JSON; se usa el mensaje genérico.
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};
