import { ApiError, ValidationError } from '@/errors/errors';
import * as MediaUsecases from '@/features/media/data/usecases/mediaUsecases';
import * as ProfileQueries from '@/features/user/data/queries/profileQueries';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new ValidationError('사용자를 찾을 수 없습니다');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new ValidationError('파일을 찾을 수 없습니다');
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new ValidationError('허용되지 않는 파일 형식입니다');
    }

    const url = await MediaUsecases.uploadProfileImage({
      file,
      userId,
    });

    await ProfileQueries.updateProfile({ userId, profileImageUrl: url });

    return NextResponse.json({ data: { url } });
  } catch (error) {
    console.error('프로필 이미지 업로드에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '프로필 이미지 업로드에 실패했습니다' },
      { status: 500 }
    );
  }
}
