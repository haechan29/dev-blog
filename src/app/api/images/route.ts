import * as ImageQueries from '@/features/image/data/queries/imageQueries';
import { ValidationError } from '@/features/user/data/errors/userErrors';
import { ApiError } from '@/lib/api';
import { r2Client } from '@/lib/r2';
import { getUserId } from '@/lib/user';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
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

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ValidationError('허용되지 않는 파일 형식입니다');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError('파일 크기는 2MB 이하여야 합니다');
    }

    const ext = file.type.split('/')[1];
    const key = `${nanoid()}.${ext}`;
    const url = `${process.env.R2_PUBLIC_URL}/${key}`;

    await ImageQueries.createImage({
      url,
      sizeBytes: file.size,
      userId,
    });

    const buffer = Buffer.from(await file.arrayBuffer());

    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return NextResponse.json({ data: { url } });
  } catch (error) {
    console.error('이미지 업로드에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다' },
      { status: 500 }
    );
  }
}
