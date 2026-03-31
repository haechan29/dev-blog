import { ApiError, UnauthorizedError } from '@/errors/errors';
import * as PostLikeQueries from '@/features/post-interaction/data/queries/postLikeQueries';
import * as PostStatUsecase from '@/features/postStat/data/usecases/postStatUsecase';
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

    const isLiked = await PostLikeQueries.fetchPostLike(userId, postId);

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

    await PostLikeQueries.createPostLike(userId, postId);

    try {
      await PostStatUsecase.incrementPostStatLikeCount(postId);
    } catch (error) {
      console.error('게시글 통계 좋아요 수 증가 요청이 실패했습니다', error);
    }

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

    await PostLikeQueries.deletePostLike(userId, postId);

    try {
      await PostStatUsecase.decrementPostStatLikeCount(postId);
    } catch (error) {
      console.error('게시글 통계 좋아요 수 감소 요청이 실패했습니다', error);
    }

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
