import { auth } from '@/auth';
import { ApiError, ValidationError } from '@/errors/errors';
import * as CommentQueries from '@/features/comment/data/queries/commentQueries';
import * as RankedCommentUsecase from '@/features/comment/data/usecases/rankedCommentUsecase';
import * as NotificationQueries from '@/features/notification/data/queries/notificationQueries';
import * as PostQueries from '@/features/post/data/queries/postQueries';
import * as PostStatUsecase from '@/features/postStat/data/usecases/postStatUsecase';
import { getUserId } from '@/lib/user';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const timestamp = searchParams.get('timestamp') ?? undefined;
    const cursorScoreRaw = searchParams.get('cursorScore');
    const cursorIdRaw = searchParams.get('cursorId');

    const data = await RankedCommentUsecase.getRankedComments({
      postId,
      userId,
      timestamp,
      ...(cursorScoreRaw != null &&
        cursorIdRaw != null && {
          cursorScore: parseInt(cursorScoreRaw),
          cursorId: parseInt(cursorIdRaw),
        }),
    });
    return NextResponse.json({ data });
  } catch (error) {
    console.error('댓글 조회 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '댓글 조회 요청이 실패했습니다' },
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
    const { content, password } = await request.json();

    const session = await auth();
    const userId = await getUserId();

    if (!content) {
      throw new ValidationError('내용을 찾을 수 없습니다');
    }

    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }

    if (!session && !password) {
      throw new ValidationError('비밀번호를 찾을 수 없습니다');
    }

    const passwordHash = session ? null : await bcrypt.hash(password, 10);

    const comment = await CommentQueries.createComment(
      postId,
      content,
      passwordHash,
      userId
    );

    try {
      await PostStatUsecase.incrementPostStatCommentCount(postId);
    } catch (error) {
      console.error('게시글 통계 댓글 수 증가 요청이 실패했습니다', error);
    }

    try {
      const post = await PostQueries.fetchPostForAuth(postId);
      if (post.user_id !== comment.userId) {
        await NotificationQueries.upsertUnreadCommentNotification({
          postId,
          authorId: post.user_id,
          commentUserId: comment.userId,
          representativeCommentId: comment.id,
        });
      }
    } catch (notificationError) {
      console.error('댓글 알림 생성에 실패했습니다', notificationError);
    }

    return NextResponse.json({ data: comment });
  } catch (error) {
    console.error('댓글 생성 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '댓글 생성 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
