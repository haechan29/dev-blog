import { ErrorCode } from '@/types/api';

export const api = {
  get: (url: string, options?: RequestInit) =>
    fetchWithErrorHandling(url, options),

  post: (url: string, body?: unknown, options?: RequestInit) =>
    fetchWithErrorHandling(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...options,
    }),

  put: (url: string, body: unknown, options?: RequestInit) =>
    fetchWithErrorHandling(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...options,
    }),

  patch: (url: string, body: unknown, options?: RequestInit) =>
    fetchWithErrorHandling(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...options,
    }),

  delete: (url: string, options?: RequestInit) =>
    fetchWithErrorHandling(url, { method: 'DELETE', ...options }),
};

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const { error, code } = await response.json();
    throw new ApiError(error, code);
  }

  return response.json();
}

export class ApiError extends Error {
  constructor(message: string, public readonly code?: ErrorCode) {
    super(message);
    this.name = 'ApiError';
  }
}
