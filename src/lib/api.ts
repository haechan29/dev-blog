import { isServer } from '@tanstack/react-query';

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
  const baseUrl = isServer
    ? process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    : '';

  if (baseUrl === undefined) {
    throw new Error('base url을 읽어오지 못했습니다.');
  }

  const response = await fetch(baseUrl + url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json();
}
