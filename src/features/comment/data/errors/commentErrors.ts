import { ApiError } from '@/errors/errors';
import { ErrorCode } from '@/types/errorCode';

export class CommentNotFoundError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.COMMENT_NOT_FOUND, 404);
  }
}
