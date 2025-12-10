import { ValidationError } from '@/features/user/data/errors/userErrors';
import * as UserQueries from '@/features/user/data/queries/userQueries';
import { ApiError } from '@/lib/api';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET() {
  try {
    const userId = await getUserId();
    const data = userId ? await UserQueries.fetchUser(userId) : null;
    return NextResponse.json({ data });
  } catch (error) {
    console.error('유저 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '유저 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { nickname } = await request.json();

    if (!nickname) {
      throw new ValidationError('닉네임을 찾을 수 없습니다');
    }

    if (nickname.length < 2 || nickname.length > 20) {
      throw new ValidationError('닉네임은 2-20자여야 합니다');
    }

    if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
      throw new ValidationError('한글, 영문, 숫자만 사용 가능합니다');
    }

    await UserQueries.updateUser(nickname);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('회원가입 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '회원가입 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await Promise.all([
      UserQueries.deleteUser(),
      UserQueries.hardDeleteAuthUser(),
    ]);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('회원 탈퇴 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '회원 탈퇴 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
