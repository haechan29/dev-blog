import { ApiError, UnauthorizedError, ValidationError } from '@/errors/errors';
import * as SeriesQueries from '@/features/series/data/queries/seriesQueries';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; seriesId: string }> }
) {
  try {
    const { seriesId } = await params;
    const data = await SeriesQueries.fetchSeries(seriesId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('시리즈 조회 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '시리즈 조회 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; seriesId: string }> }
) {
  try {
    const { userId, seriesId } = await params;

    const innerUserId = await getUserId();
    if (userId !== innerUserId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { title, description } = await request.json();
    if (!title) {
      throw new ValidationError('제목을 찾을 수 없습니다');
    }

    const updated = await SeriesQueries.updateSeries({
      seriesId,
      title,
      description: description ?? null,
      userId,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('시리즈 수정 요청이 실패했습니다');

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '시리즈 수정 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; seriesId: string }> }
) {
  try {
    const { userId, seriesId } = await params;

    const innerUserId = await getUserId();
    if (userId !== innerUserId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    await SeriesQueries.deleteSeries(seriesId, userId);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('시리즈 삭제 요청이 실패했습니다');

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '시리즈 삭제 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
