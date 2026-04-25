import { ApiError, ValidationError } from '@/errors/errors';
import * as NotificationUsecase from '@/features/notification/data/usecases/notificationUsecase';
import * as InteractionUsecase from '@/features/post-interaction/data/usecases/interactionUsecase';
import * as PostQueries from '@/features/post/data/queries/postQueries';
import * as PostStatQueries from '@/features/postStat/data/queries/postStatQueries';
import * as PostStatUsecase from '@/features/postStat/data/usecases/postStatUsecase';
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
      return NextResponse.json({ data: null });
    }

    const post = await PostQueries.fetchPostForAuth(postId);
    if (post.userId === userId) {
      return NextResponse.json({ data: null });
    }

    const { readDuration, fromFeed } = await request.json();

    await InteractionUsecase.recordView(userId, postId, readDuration, fromFeed);

    try {
      const postStat = await PostStatQueries.fetchPostStatByPostId(postId);

      if (!postStat) {
        throw new ValidationError('게시글 통계를 찾을 수 없습니다');
      }

      const { view_count: prevViewCount, avg_read_time: prevAvgReadTime } =
        postStat;

      await Promise.all([
        PostStatUsecase.incrementPostStatViewWithReadTime({
          postId,
          prevViewCount,
          prevAvgReadTime,
          readDuration,
        }),
        NotificationUsecase.insertPostViewMilestoneNotification({
          postId,
          authorId: post.userId,
          milestoneValue: prevViewCount + 1,
        }),
      ]);
    } catch (error) {
      console.error(
        '게시글 통계 조회 수 증가 / 알림 생성 요청이 실패했습니다',
        error
      );
    }

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
