import { auth } from '@/auth';
import { ApiError, UnauthorizedError, ValidationError } from '@/errors/errors';
import * as UserQueries from '@/features/user/data/queries/userQueries';
import * as UserUsecase from '@/features/user/data/usecases/userUsecase';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id') ?? (await getUserId());

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
    const userId = (await auth())?.user?.id;

    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { nickname } = await request.json();

    if (!nickname) {
      throw new ValidationError('닉네임을 찾을 수 없습니다');
    }

    if (nickname.length < 1 || nickname.length > 50) {
      throw new ValidationError('닉네임은 1-50자여야 합니다');
    }

    const now = new Date().toISOString();

    await UserQueries.updateUser({
      userId,
      nickname,
      registeredAt: now,
      deletedAt: null,
    });

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
    const session = await auth();
    const userIdFromSession = session?.user?.id;

    if (!userIdFromSession) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    await UserUsecase.softDeleteUser(userIdFromSession);

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
