import * as InteractionUsecase from '@/features/post-interaction/data/usecases/interactionUsecase';
import { UnauthorizedError } from '@/features/user/data/errors/userErrors';
import { ApiError } from '@/lib/api';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const userId = await getUserId();

    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { readDuration, fromFeed } = await request.json();

    await InteractionUsecase.recordView(userId, postId, readDuration, fromFeed);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('조회 기록 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '조회 기록 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
