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
