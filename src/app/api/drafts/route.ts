import { ApiError, UnauthorizedError } from '@/errors/errors';
import * as DraftQueries from '@/features/draft/data/queries/draftQueries';
import { getUserId } from '@/lib/user';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const data = await DraftQueries.fetchDraftsByUserId(userId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('임시저장 목록 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '임시저장 목록 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

