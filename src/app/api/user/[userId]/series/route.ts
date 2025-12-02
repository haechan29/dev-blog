import * as SeriesQueries from '@/features/series/data/queries/seriesQueries';
import { ValidationError } from '@/features/user/data/errors/userErrors';
import { ApiError } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }

    const data = await SeriesQueries.fetchSeriesByUserId(userId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('시리즈 목록 조회 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '시리즈 목록 조회 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
