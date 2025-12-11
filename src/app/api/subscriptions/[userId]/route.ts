import * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';
import { ApiError } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    await SubscriptionQueries.createSubscription(userId);
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
