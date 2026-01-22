import { ApiError } from '@/errors/errors';
import { ErrorCode } from '@/types/errorCode';

export class PostForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.POST_FORBIDDEN, 403);
  }
}
