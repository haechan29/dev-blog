import { auth } from '@/auth';
import {
  UnauthorizedError,
  ValidationError,
} from '@/features/user/data/errors/userErrors';
import * as UserQueries from '@/features/user/data/queries/userQueries';
import { ApiError } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET() {
  try {
    const session = await auth();

    let data;
    if (session?.user?.id) {
      const authId = session.user.id;
      data = await UserQueries.fetchUserByAuthId(authId);
    } else {
      const cookieStore = await cookies();
      const userId = cookieStore.get('userId')?.value;
      data = userId ? await UserQueries.fetchUserById(userId) : null;
    }

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
    const session = await auth();
    if (!session?.user?.id) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

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

    const userId = request.cookies.get('userId')?.value;
    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }
    await UserQueries.updateUser(userId, nickname, session.user.id);

    const response = NextResponse.json({ data: null });
    response.cookies.delete('userId');
    return response;
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
    const session = await auth();
    if (!session?.user?.id) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const authUserId = session.user.id;

    await Promise.all([
      UserQueries.deleteUserByAuthId(authUserId),
      UserQueries.hardDeleteAuthUser(authUserId),
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
