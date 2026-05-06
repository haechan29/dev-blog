import { ErrorCode } from '@/types/errorCode';
import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  toResponse() {
    return NextResponse.json(
      {
        error: this.message,
        code: this.code,
      },
      { status: this.statusCode }
    );
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

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.FORBIDDEN, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.NOT_FOUND, 404);
  }
}

export class ExternalServiceError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.EXTERNAL_SERVICE_ERROR, 422);
  }
}

export class InternalError extends ApiError {
  constructor(message: string) {
    super(message, ErrorCode.INTERNAL_ERROR, 500);
  }
}
