import { ApiError, UnauthorizedError } from '@/errors/errors';
import * as InteractionQueries from '@/features/post-interaction/data/queries/interactionQueries';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ data: false });
    }

    const isLiked = await InteractionQueries.selectLike(userId, postId);

    return NextResponse.json({ data: isLiked });
  } catch (error) {
    console.error('좋아요 상태 조회가 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '좋아요 상태 조회가 실패했습니다' },
      { status: 500 }
    );
  }
}

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

    await InteractionQueries.insertLike(userId, postId);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('좋아요 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '좋아요 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const userId = await getUserId();

    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    await InteractionQueries.deleteLike(userId, postId);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('좋아요 취소 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '좋아요 취소 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
