import { ApiError, UnauthorizedError, ValidationError } from '@/errors/errors';
import * as NotificationUsecase from '@/features/notification/data/usecases/notificationUsecase';
import * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';
import * as UserQueries from '@/features/user/data/queries/userQueries';
import * as UserUsecase from '@/features/user/data/usecases/userUsecase';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: followingUserId } = await params;

    const followerUserId = await getUserId();

    const subscriptionInfo = await SubscriptionQueries.getSubscriptionInfo({
      followerUserId,
      followingUserId,
    });

    return NextResponse.json({ data: subscriptionInfo });
  } catch (error) {
    console.error('구독 여부 조회가 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '구독 여부 조회가 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const followerUserId = await getUserId();
    if (!followerUserId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { userId: followingUserId } = await params;

    await SubscriptionQueries.createSubscription(
      followingUserId,
      followerUserId
    );

    try {
      const user = await UserQueries.fetchUser(followingUserId);

      if (!user) {
        throw new ValidationError('사용자를 찾을 수 없습니다');
      }

      const { subscriberCount } = user;

      await Promise.all([
        UserUsecase.incrementSubscriberCount(followingUserId, subscriberCount),
        NotificationUsecase.insertSubscriberMilestoneNotification({
          followingUserId,
          followerUserId,
          milestoneValue: subscriberCount + 1,
        }),
      ]);
    } catch (notificationError) {
      console.error(
        '구독자 수 증가 / 알림 생성 요청이 실패했습니다',
        notificationError
      );
    }

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('구독 요청이 실패했습니다', error);
    if (error instanceof ApiError) return error.toResponse();
    return NextResponse.json(
      { error: '구독 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: followingUserId } = await params;

    const deleted =
      await SubscriptionQueries.deleteSubscription(followingUserId);

    if (deleted?.length) {
      try {
        await UserUsecase.decrementSubscriberCount(followingUserId);
      } catch (error) {
        console.error('구독자 수 감소 요청이 실패했습니다', error);
      }
    }

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('구독취소 요청이 실패했습니다', error);
    if (error instanceof ApiError) return error.toResponse();
    return NextResponse.json(
      { error: '구독취소 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
