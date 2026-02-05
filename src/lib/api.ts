import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/media/data/errors/mediaErrors';
import { PostForbiddenError } from '@/features/post/data/errors/postErrors';
import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import { ErrorCode } from '@/types/errorCode';

export const api = {
  get: (url: string, options?: RequestInit) =>
    fetchWithErrorHandling(url, options),

  post: (url: string, body?: unknown, options?: RequestInit) =>
    fetchWithErrorHandling(url, {
      method: 'POST',
      ...createHeadersAndBody(body),
      ...options,
    }),

  put: (url: string, body: unknown, options?: RequestInit) =>
    fetchWithErrorHandling(url, {
      method: 'PUT',
      ...createHeadersAndBody(body),
      ...options,
    }),

  patch: (url: string, body: unknown, options?: RequestInit) =>
    fetchWithErrorHandling(url, {
      method: 'PATCH',
      ...createHeadersAndBody(body),
      ...options,
    }),

  delete: (url: string, options?: RequestInit) =>
    fetchWithErrorHandling(url, { method: 'DELETE', ...options }),
};

function createHeadersAndBody(body: unknown) {
  const isFormData = body instanceof FormData;
  return {
    ...(!isFormData && { headers: { 'Content-Type': 'application/json' } }),
    body: isFormData ? body : JSON.stringify(body),
  };
}

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
    case ErrorCode.DAILY_QUOTA_EXHAUSTED:
      return new DailyQuotaExhaustedError(message);
    case ErrorCode.DUPLICATE_NICKNAME:
      return new DuplicateNicknameError(message);
    case ErrorCode.POST_FORBIDDEN:
      return new PostForbiddenError(message);
    default:
      return new ApiError(message, code, status);
  }
}
