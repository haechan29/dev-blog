import { ApiError } from '@/lib/api';
import { ErrorCode } from '@/types/errorCode';

export class DuplicateNicknameError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.DUPLICATE_NICKNAME, 409);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.UNAUTHORIZED, 401);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.VALIDATION_ERROR, 400);
  }
}
