import { ApiError, ValidationError } from '@/errors/errors';
import * as CommentQueries from '@/features/comment/data/queries/commentQueries';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const { postId, commentId: commentIdParam } = await params;

    const commentIdNum = Number(commentIdParam);
    if (!Number.isInteger(commentIdNum)) {
      throw new ValidationError('유효하지 않은 댓글 ID입니다');
    }

    const { post_id: commentPostId, like_count: likeCount } =
      await CommentQueries.fetchComment(commentIdNum);

    if (commentPostId !== postId) {
      throw new ValidationError('댓글이 속한 게시글이 일치하지 않습니다');
    }

    const newLikeCount = Math.max(0, likeCount - 1);

    const updated = await CommentQueries.updateComment({
      commentId: commentIdNum,
      likeCount: newLikeCount,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('댓글 좋아요 수 감소 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '댓글 좋아요 수 감소 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}
