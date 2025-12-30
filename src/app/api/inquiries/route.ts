import { ApiError, UnauthorizedError, ValidationError } from '@/errors/errors';
import * as InquiryQueries from '@/features/inquiry/data/queries/inquiryQueries';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      throw new UnauthorizedError('사용자 아이디를 찾을 수 없습니다');
    }

    const { content } = await request.json();

    if (!content || content.trim() === '') {
      throw new ValidationError('내용을 입력해주세요');
    }

    await InquiryQueries.createInquiry({ userId, content });

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('문의 등록에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '문의 등록에 실패했습니다' },
      { status: 500 }
    );
  }
}
