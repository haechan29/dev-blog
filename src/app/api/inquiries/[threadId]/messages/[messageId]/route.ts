import { ApiError } from '@/errors/errors';
import * as InquiryMessageUsecase from '@/features/inquiry/data/usecases/inquiryMessageUsecase';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ threadId: string; messageId: string }> }
) {
  try {
    const { threadId, messageId } = await params;
    const userId = await getUserId();
    await InquiryMessageUsecase.deleteMyInquiryMessage({
      userId,
      threadId,
      messageId,
    });

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('문의 메시지 삭제에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '문의 메시지 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
