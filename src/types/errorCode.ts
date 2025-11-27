export const ErrorCode = {
  DUPLICATE_NICKNAME: 'DUPLICATE_NICKNAME',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
