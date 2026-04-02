import { ApiError } from '@/errors/errors';
import * as NotificationUsecase from '@/features/notification/data/usecases/notificationUsecase';
import { getUserId } from '@/lib/user';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = await getUserId();
    const data = await NotificationUsecase.getUnreadNotificationCount({
      userId,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('미읽음 알림 개수 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '미읽음 알림 개수 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
