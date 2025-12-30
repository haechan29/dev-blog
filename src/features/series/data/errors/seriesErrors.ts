import { ApiError } from '@/errors/errors';
import { ErrorCode } from '@/types/errorCode';

export class SeriesNotFoundError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.SERIES_NOT_FOUND, 404);
  }
}
