import { ApiError } from '@/lib/api';
import { ErrorCode } from '@/types/errorCode';

export class RateLimitError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429);
  }
}
