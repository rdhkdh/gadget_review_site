const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function headers(includeAuth = false): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (includeAuth && token) (h as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  return h;
}

export async function api<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = false, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: { ...headers(auth), ...(rest.headers as HeadersInit) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || res.statusText);
  return data as T;
}

export const auth = {
  login: (email: string, password: string) =>
    api<{ user: import('../types').User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    api<{ user: import('../types').User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api('/auth/change-password', {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  deleteAccount: () => api('/auth/account', { method: 'DELETE', auth: true }),
  getToken: () => getToken(),
  setToken: (token: string) => localStorage.setItem('token', token),
  clearToken: () => localStorage.removeItem('token'),
  getUser: (): import('../types').User | null => {
    const u = localStorage.getItem('auth_user');
    return u ? JSON.parse(u) : null;
  },
  setUser: (user: import('../types').User) =>
    localStorage.setItem('auth_user', JSON.stringify(user)),
  clearUser: () => localStorage.removeItem('auth_user'),
};

export const categories = {
  list: () => api<import('../types').Category[]>('/categories'),
};

export const brands = {
  list: (categoryId?: number) =>
    api<import('../types').Brand[]>(categoryId ? `/brands?categoryId=${categoryId}` : '/brands'),
  create: (name: string) =>
    api<import('../types').Brand>('/brands', { method: 'POST', auth: true, body: JSON.stringify({ name }) }),
};

export interface GadgetFilters {
  categoryId?: number;
  brandId?: number;
  minRating?: number;
  search?: string;
  sortBy?: import('../types').SortOption;
}

export const gadgets = {
  list: (filters: GadgetFilters) => {
    const params = new URLSearchParams();
    if (filters.categoryId != null) params.set('categoryId', String(filters.categoryId));
    if (filters.brandId != null) params.set('brandId', String(filters.brandId));
    if (filters.minRating != null) params.set('minRating', String(filters.minRating));
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    return api<import('../types').Gadget[]>(`/gadgets?${params}`);
  },
  getById: (id: number) => api<import('../types').Gadget & { reviews?: import('../types').Review[] }>(`/gadgets/${id}`),
  create: (data: {
    name: string;
    brandId: number;
    categoryId: number;
    model: string;
    price: number;
    description?: string;
    performanceSpecs?: Record<string, unknown>;
    imageUrl?: string;
  }) => api<import('../types').Gadget>('/gadgets', { method: 'POST', auth: true, body: JSON.stringify(data) }),
  remove: (id: number) => api<void>(`/gadgets/${id}`, { method: 'DELETE', auth: true }),
};

export const reviews = {
  listByGadget: (gadgetId: number) =>
    api<import('../types').Review[]>(`/reviews/gadget/${gadgetId}`),
  listByUser: () =>
    api<import('../types').UserReview[]>('/reviews/user/me', { auth: true }),
  create: (gadgetId: number, rating: number, comment?: string) =>
    api<import('../types').Review>(`/reviews/gadget/${gadgetId}`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ rating, comment }),
    }),
  update: (reviewId: number, rating: number, comment?: string) =>
    api<import('../types').Review>(`/reviews/${reviewId}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify({ rating, comment }),
    }),
  remove: (reviewId: number) =>
    api<void>(`/reviews/${reviewId}`, { method: 'DELETE', auth: true }),
};
