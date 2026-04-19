import { ApiError, UnauthorizedError } from '@/errors/errors';
import * as InquiryThreadUsecase from '@/features/inquiry/data/usecases/inquiryThreadUsecase';
import { isInquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';
import { checkAdmin } from '@/lib/admin';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const isAdmin = await checkAdmin();

    const { searchParams } = new URL(request.url);
    const cursorUpdatedAt = searchParams.get('cursorUpdatedAt');
    const cursorId = searchParams.get('cursorId');
    const statusRaw = searchParams.get('status');

    const status =
      statusRaw && isInquiryThreadStatus(statusRaw) ? statusRaw : undefined;

    const data = isAdmin
      ? await InquiryThreadUsecase.getInquiryThreads({
          cursorUpdatedAt,
          cursorId,
          status,
        })
      : await InquiryThreadUsecase.getMyInquiryThreads({
          userId,
          cursorUpdatedAt,
          cursorId,
        });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('스레드 목록 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '스레드 목록 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { content = '', images } = await request.json();
    const data = await InquiryThreadUsecase.createMyInquiryThread({
      userId,
      content,
      images,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('스레드 생성에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '스레드 생성에 실패했습니다' },
      { status: 500 }
    );
  }
}
