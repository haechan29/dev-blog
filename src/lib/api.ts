import { RateLimitError } from '@/features/image/data/errors/imageErrors';
import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import { ErrorCode } from '@/types/errorCode';
import { NextResponse } from 'next/server';

export const api = {
  get: (url: string, options?: RequestInit) =>
    fetchWithErrorHandling(url, options),

  post: (url: string, body?: unknown, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return fetchWithErrorHandling(url, {
      method: 'POST',
      ...(!isFormData && { headers: { 'Content-Type': 'application/json' } }),
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
  },

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
    throw createApiError(error, code, response.status);
  }

  return response.json();
}

function createApiError(
  message: string,
  code: ErrorCode,
  status: number
): ApiError {
  switch (code) {
    case ErrorCode.RATE_LIMIT_EXCEEDED:
      return new RateLimitError(message);
    case ErrorCode.DUPLICATE_NICKNAME:
      return new DuplicateNicknameError(message);
    default:
      return new ApiError(message, code, status);
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  toResponse() {
    return NextResponse.json(
      {
        error: this.message,
        code: this.code,
      },
      { status: this.statusCode }
    );
  }
}
