import { ApiError, UnauthorizedError, ValidationError } from '@/errors/errors';
import { toDto } from '@/features/comment/data/mapper/commentMapper';
import * as CommentQueries from '@/features/comment/data/queries/commentQueries';
import * as NotificationUsecase from '@/features/notification/data/usecases/notificationUsecase';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { postId, commentId: commentIdParam } = await params;

    const commentIdNum = Number(commentIdParam);
    if (!Number.isInteger(commentIdNum)) {
      throw new ValidationError('유효하지 않은 댓글 ID입니다');
    }

    const {
      postId: commentPostId,
      userId: commentUserId,
      likeCount,
    } = await CommentQueries.fetchComment(commentIdNum);

    if (commentPostId !== postId) {
      throw new ValidationError('댓글이 속한 게시글이 일치하지 않습니다');
    }

    const newLikeCount = likeCount + 1;

    const updated = await CommentQueries.updateComment({
      commentId: commentIdNum,
      likeCount: newLikeCount,
    });

    try {
      await NotificationUsecase.insertCommentLikeMilestoneNotification({
        postId,
        likeUserId: userId,
        commentUserId,
        commentId: commentIdNum,
        milestoneValue: newLikeCount,
      });
    } catch (error) {
      console.error('댓글 좋아요 마일스톤 알림 생성에 실패했습니다', error);
    }

    const comment = toDto(updated);
    return NextResponse.json({ data: comment });
  } catch (error) {
    console.error('댓글 좋아요 수 증가 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '댓글 좋아요 수 증가 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}
