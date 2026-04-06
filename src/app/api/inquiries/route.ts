import { ApiError } from '@/errors/errors';
import * as InquiryThreadUsecase from '@/features/inquiry/data/usecases/inquiryThreadUsecase';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const cursorUpdatedAt = searchParams.get('cursorUpdatedAt');
    const cursorId = searchParams.get('cursorId');

    const data = await InquiryThreadUsecase.getMyInquiryThreads({
      userId,
      cursorUpdatedAt,
      cursorId,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('문의 스레드 목록 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '문의 스레드 목록 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
