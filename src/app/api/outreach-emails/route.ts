import { ApiError } from '@/errors/errors';
import { toData } from '@/features/outreach-email/data/mapper/outreachEmailMapper';
import * as OutreachEmailQueries from '@/features/outreach-email/data/queries/outreachEmailQueries';
import { assertAdmin } from '@/lib/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await assertAdmin();

    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId') ?? undefined;

    const emails = await OutreachEmailQueries.fetchOutreachEmails(creatorId);
    const data = emails.map(toData);

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ApiError) {
      return error.toResponse();
    }

    console.error('아웃리치 이메일 목록 조회에 실패했습니다', error);
    return NextResponse.json(
      { error: '아웃리치 이메일 목록 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
