import { ApiError } from '@/errors/errors';
import { syncEmails } from '@/features/outreach-email/data/usecases/outreachEmailUsecase';
import { assertAdmin } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await assertAdmin();

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
