import { ApiError, UnauthorizedError } from '@/errors/errors';
import * as InquiryMessageUsecase from '@/features/inquiry/data/usecases/inquiryMessageUsecase';
import { checkAdmin } from '@/lib/admin';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const userId = await getUserId();
    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { content = '', images } = await request.json();
    const data = await InquiryMessageUsecase.createMyInquiryMessage({
      userId,
      threadId,
      content,
      images,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('문의 메시지 생성에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '문의 메시지 생성에 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const userId = await getUserId();
    const isAdmin = await checkAdmin();
    const data = isAdmin
      ? await InquiryMessageUsecase.getInquiryMessagesByThreadId({ threadId })
      : await InquiryMessageUsecase.getMyInquiryMessagesByThreadId({
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
