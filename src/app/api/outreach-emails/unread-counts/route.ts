import { ApiError } from '@/errors/errors';
import * as OutreachEmailQueries from '@/features/outreach-email/data/queries/outreachEmailQueries';
import { assertAdmin } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await assertAdmin();

    const counts = await OutreachEmailQueries.fetchUnreadCounts();
    return NextResponse.json({ data: counts });
  } catch (error) {
    console.error('미열람 이메일 갯수 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '미열람 이메일 갯수 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
