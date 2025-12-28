import { ApiError } from '@/errors/errors';
import { ErrorCode } from '@/types/errorCode';

export class PostNotFoundError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.POST_NOT_FOUND, 404);
  }
}
