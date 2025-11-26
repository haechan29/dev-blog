import { auth } from '@/auth';
import {
  createUser,
  DuplicateNicknameError,
} from '@/features/user/data/queries/userQueries';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: '인증되지 않은 요청입니다' },
      { status: 401 }
    );
  }

  const { nickname } = await request.json();

  if (!nickname) {
    return NextResponse.json(
      { error: '회원가입 요청에 필요한 필드가 누락되었습니다' },
      { status: 400 }
    );
  }

  if (nickname.length < 2 || nickname.length > 20) {
    return NextResponse.json(
      { error: '닉네임은 2-20자여야 합니다' },
      { status: 400 }
    );
  }

  if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
    return NextResponse.json(
      { error: '한글, 영문, 숫자만 사용 가능합니다' },
      { status: 400 }
    );
  }

  try {
    await createUser(session.user.id, nickname);
    return NextResponse.json({ data: null });
  } catch (error) {
    if (error instanceof DuplicateNicknameError) {
      return NextResponse.json(
        { error: '이미 사용 중인 닉네임입니다' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: '회원가입 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
