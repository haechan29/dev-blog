import * as SeriesQueries from '@/features/series/data/queries/seriesQueries';
import {
  UnauthorizedError,
  ValidationError,
} from '@/features/user/data/errors/userErrors';
import { ApiError } from '@/lib/api';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const innerUserId = await getUserId();

    if (userId !== innerUserId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { title, description } = await request.json();
    if (!title) {
      throw new ValidationError('제목을 찾을 수 없습니다');
    }

    await SeriesQueries.createSeries({
      title,
      description: description ?? null,
      userId,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('시리즈 생성 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '시리즈 생성 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
