import { ApiError, UnauthorizedError } from '@/errors/errors';
import * as DraftQueries from '@/features/draft/data/queries/draftQueries';
import * as DraftUsecase from '@/features/draft/data/usecases/draftUsecase';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await DraftUsecase.getDrafts();
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

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const {
      postId = null,
      title = '',
      contentJson = null,
      tags = [],
    } = await request.json();

    const data = await DraftQueries.createDraft({
      userId,
      postId,
      title,
      contentJson,
      tags,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('임시저장 생성 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '임시저장 생성 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
