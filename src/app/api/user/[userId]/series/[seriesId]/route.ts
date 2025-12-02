import { auth } from '@/auth';
import * as SeriesQueries from '@/features/series/data/queries/seriesQueries';
import {
  UnauthorizedError,
  ValidationError,
} from '@/features/user/data/errors/userErrors';
import { ApiError } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; seriesId: string }> }
) {
  try {
    const { userId, seriesId } = await params;

    const session = await auth();
    if (session?.user?.id !== userId) {
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

    const session = await auth();
    if (session?.user?.id !== userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    await SeriesQueries.deleteSeries(seriesId);

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
