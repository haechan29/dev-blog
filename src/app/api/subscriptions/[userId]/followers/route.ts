import * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';
import { ApiError } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const followers = await SubscriptionQueries.getFollowers(userId);
    return NextResponse.json({ data: followers });
  } catch (error) {
    console.error('팔로워 목록 조회가 실패했습니다', error);
    if (error instanceof ApiError) return error.toResponse();
    return NextResponse.json(
      { error: '팔로워 목록 조회가 실패했습니다' },
      { status: 500 }
    );
  }
}
