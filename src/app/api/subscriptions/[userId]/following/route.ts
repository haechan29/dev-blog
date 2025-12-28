import { ApiError } from '@/errors/errors';
import * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const following = await SubscriptionQueries.getFollowing(userId);
    return NextResponse.json({ data: following });
  } catch (error) {
    console.error('팔로잉 목록 조회가 실패했습니다', error);
    if (error instanceof ApiError) return error.toResponse();
    return NextResponse.json(
      { error: '팔로잉 목록 조회가 실패했습니다' },
      { status: 500 }
    );
  }
}
