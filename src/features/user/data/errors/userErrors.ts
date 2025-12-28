import { ApiError } from '@/errors/errors';
import { ErrorCode } from '@/types/errorCode';

export class DuplicateNicknameError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.DUPLICATE_NICKNAME, 409);
  }
}
