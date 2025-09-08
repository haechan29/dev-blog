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

  delete: (url: string, options?: RequestInit) =>
    fetchWithErrorHandling(url, { method: 'DELETE', ...options }),
};

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  const baseUrl = isServer ? process.env.NEXT_PUBLIC_URL : '';

  if (baseUrl === undefined) {
    throw new Error('base url을 읽어오지 못했습니다.');
  }

  const response = await fetch(baseUrl + url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}
