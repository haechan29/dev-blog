import { ApiError, UnauthorizedError } from '@/errors/errors';
import * as NotificationUsecase from '@/features/notification/data/usecases/notificationUsecase';
import * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const subscriptionInfo =
      await SubscriptionQueries.getSubscriptionInfo(userId);
    return NextResponse.json({ data: subscriptionInfo });
  } catch (error) {
    console.error('구독 여부 조회가 실패했습니다', error);
    if (error instanceof ApiError) return error.toResponse();
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
      const subscriberCount =
        await SubscriptionQueries.countSubscribers(followingUserId);
      await NotificationUsecase.insertSubscriberMilestoneNotification({
        followingUserId,
        followerUserId,
        milestoneValue: subscriberCount,
      });
    } catch (notificationError) {
      console.error(
        '구독자 수 마일스톤 알림 생성에 실패했습니다',
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
    const { userId } = await params;
    await SubscriptionQueries.deleteSubscription(userId);
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
