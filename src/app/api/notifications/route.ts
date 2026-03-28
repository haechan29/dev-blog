import { ApiError, UnauthorizedError } from '@/errors/errors';
import * as NotificationUsecase from '@/features/notification/data/usecases/notificationUsecase';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }

    const { searchParams } = new URL(request.url);
    const cursorUpdatedAt = searchParams.get('cursorUpdatedAt');
    const cursorId = searchParams.get('cursorId');

    const data = await NotificationUsecase.getNotifications({
      userId,
      cursorUpdatedAt,
      cursorId,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('알림 목록 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '알림 목록 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
