import { ApiError, ValidationError } from '@/errors/errors';
import { toDomain } from '@/features/outreach-email/data/mapper/outreachEmailMapper';
import * as OutreachEmailQueries from '@/features/outreach-email/data/queries/outreachEmailQueries';
import * as OutreachEmailUsecase from '@/features/outreach-email/data/usecases/outreachEmailUsecase';
import { assertAdmin } from '@/lib/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await assertAdmin();

    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId') ?? undefined;

    const emails = await OutreachEmailQueries.fetchOutreachEmails(creatorId);
    return NextResponse.json({ data: emails.map(toDomain) });
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

export async function POST(request: NextRequest) {
  try {
    await assertAdmin();

    const { creatorId, subject, body } = await request.json();

    if (!creatorId || !subject || !body) {
      throw new ValidationError('크리에이터 ID, 제목, 내용이 필요합니다');
    }

    await OutreachEmailUsecase.sendEmail({
      creatorId,
      subject,
      body,
    });

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('메일 발송에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : '메일 발송에 실패했습니다',
      },
      { status: 500 }
    );
  }
}
