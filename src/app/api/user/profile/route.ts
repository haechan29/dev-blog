import { ApiError, ValidationError } from '@/errors/errors';
import * as ProfileQueries from '@/features/user/data/queries/profileQueries';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function PATCH(request: NextRequest) {
  try {
    const { bio } = await request.json();

    if (bio !== undefined && bio !== null && bio.length > 200) {
      throw new ValidationError('소개는 200자 이하여야 합니다');
    }

    await ProfileQueries.updateProfile({ bio });

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('프로필 수정에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '프로필 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}
