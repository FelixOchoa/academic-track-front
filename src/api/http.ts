function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '').replace(/\/api$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://169.58.185.218:5000';
    }
    return `http://${host}:5000`;
  }
  return 'http://169.58.185.218:5000';
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const baseUrl = getBaseUrl();
  const url = new URL(path, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string | number | undefined> } = {}
): Promise<T> {
  const { params, headers, ...rest } = options;
  const url = buildUrl(path, params);

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: {
        ...(rest.body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
    });
  } catch (error) {
    throw new ApiError(0, `No se pudo conectar con el servidor. Verifica que el backend esté disponible.`);
  }

  if (!response.ok) {
    let message = `Error ${response.status} al comunicarse con el servidor.`;
    try {
      const body = await response.clone().json();
      message = body?.title ?? body?.message ?? message;
    } catch {
      // Body without JSON, keep default message
    }
    throw new ApiError(response.status, message);
  }

  return parseResponse<T>(response);
}

export const http = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    request<T>(path, { method: 'GET', params }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
