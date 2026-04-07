import { ApiError } from '@/errors/errors';
import * as InquiryMessageUsecase from '@/features/inquiry/data/usecases/inquiryMessageUsecase';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const userId = await getUserId();
    const data = await InquiryMessageUsecase.getMyInquiryMessagesByThreadId({
      userId,
      threadId,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('문의 메시지 목록 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '문의 메시지 목록 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
