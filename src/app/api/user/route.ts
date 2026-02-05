import { auth } from '@/auth';
import { ApiError, UnauthorizedError, ValidationError } from '@/errors/errors';
import * as UserQueries from '@/features/user/data/queries/userQueries';
import * as ProfileUsecase from '@/features/user/data/usecases/profileUsecase';
import { getUserId } from '@/lib/user';
import { cookies } from 'next/headers';
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
    const userId = (await cookies()).get('userId')?.value;
    const authUserId = (await auth())?.user?.id;

    if (!userId || !authUserId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { nickname } = await request.json();

    if (!nickname) {
      throw new ValidationError('닉네임을 찾을 수 없습니다');
    }

    if (nickname.length < 1 || nickname.length > 50) {
      throw new ValidationError('닉네임은 1-50자여야 합니다');
    }

    await UserQueries.updateUser({ userId, authUserId, nickname });

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
    const userId = session?.user?.user_id;

    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    await Promise.all([
      ProfileUsecase.deleteProfileMedia(userId),
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
