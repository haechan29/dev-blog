export const ErrorCode = {
  DUPLICATE_NICKNAME: 'DUPLICATE_NICKNAME',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  POST_NOT_FOUND: 'POST_NOT_FOUND',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
