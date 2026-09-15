export type StaffUser = {
  id: string;
  username: string;
  displayName: string;
};

export type StaffCatalogModel = {
  slug: string;
  name: string;
  displayOrder: number;
  coverImagePath: string;
  coverVersion: number;
  allowedCoverPaths: string[];
};

export type StaffCatalogResponse = {
  orderVersion: number;
  missingOverrides: string[];
  needsEnsure?: boolean;
  models: StaffCatalogModel[];
};

export type ActivityItem = {
  id: string;
  at: string;
  slug: string | null;
  subject: string;
  summary: string;
  details?: string[];
  automatic: boolean;
};

export type ActivityResponse = {
  items: ActivityItem[];
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

const DEFAULT_TIMEOUT_MS = 12_000;

async function parseJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit & { timeoutMs?: number }): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchInit } = init || {};
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(path, {
      credentials: 'include',
      ...fetchInit,
      signal: controller.signal,
      headers: {
        ...(fetchInit.body ? { 'Content-Type': 'application/json' } : {}),
        ...(fetchInit.headers || {}),
      },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(0, 'La solicitud tardó demasiado. Revisa la conexión e inténtalo de nuevo.');
    }
    throw new ApiError(0, 'No se pudo conectar con el servidor.');
  } finally {
    window.clearTimeout(timer);
  }

  const body = await parseJson(res);
  if (!res.ok) {
    let message =
      body && typeof body === 'object' && 'error' in body && typeof (body as { error: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `HTTP ${res.status}`;
    if (res.status === 401 && (message === 'unauthorized' || message === 'invalid credentials')) {
      message =
        message === 'invalid credentials'
          ? 'Usuario o contraseña incorrectos'
          : 'Sesión caducada. Vuelve a iniciar sesión.';
    }
    if (res.status === 403 && (message === 'invalid origin' || message === 'missing origin')) {
      message = 'No se pudo verificar el origen de la petición. Recarga la app e inténtalo de nuevo.';
    }
    throw new ApiError(res.status, message, body);
  }
  return body as T;
}

export function login(username: string, password: string) {
  return request<StaffUser>('/api/staff/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return request<{ ok: true }>('/api/staff/logout', { method: 'POST' });
}

export function getMe() {
  return request<StaffUser>('/api/staff/me');
}

export function getCatalog() {
  return request<StaffCatalogResponse>('/api/staff/catalog');
}

export function ensureCatalog() {
  return request<{
    ok: true;
    wrote: boolean;
    catalog: StaffCatalogResponse;
  }>('/api/staff/catalog/ensure', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export function getActivity(limit = 40) {
  return request<ActivityResponse>(`/api/staff/activity?limit=${limit}`);
}

export function putOrder(version: number, orderedSlugs: string[]) {
  return request<{ ok: true; orderVersion: number }>('/api/staff/order', {
    method: 'PUT',
    body: JSON.stringify({ version, orderedSlugs }),
  });
}

export function putCover(slug: string, coverImagePath: string, version: number) {
  return request<{ ok: true; coverVersion: number; coverImagePath: string }>('/api/staff/cover', {
    method: 'PUT',
    body: JSON.stringify({ slug, coverImagePath, version }),
  });
}
