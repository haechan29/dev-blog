import { ApiError, UnauthorizedError } from '@/errors/errors';
import { syncEmails } from '@/features/outreach-email/data/usecases/outreachEmailUsecase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new UnauthorizedError('CRON_SECRET이 일치하지 않습니다');
    }

    const result = await syncEmails();
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('이메일 동기화에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '이메일 동기화에 실패했습니다' },
      { status: 500 }
    );
  }
}
