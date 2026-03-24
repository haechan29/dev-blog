import { ApiError } from '@/errors/errors';
import * as TagQueries from '@/features/tag/data/queries/tagQueries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() ?? '';
    const data = await TagQueries.fetchTagNames(query);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('태그 목록 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '태그 목록 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
