import {
  AVATAR_IMAGE_VARIANTS,
  POST_IMAGE_VARIANTS,
} from '@/features/media/constants/image-variants';
import * as MediaQueries from '@/features/media/data/queries/mediaQueries';
import { r2Client } from '@/lib/r2';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'CRON_SECRET이 일치하지 않습니다' },
      { status: 401 }
    );
  }

  try {
    const mediaList = await MediaQueries.getOrphanMediaList();

    await Promise.all(
      mediaList.flatMap(media => {
        const filename = media.url.split('/').pop();
        if (!filename) return [];

        const baseKey = filename
          .replace(/-\d+\.webp$/, '')
          .replace('-original.webp', '');

        return [...POST_IMAGE_VARIANTS, ...AVATAR_IMAGE_VARIANTS].map(variant =>
          r2Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: `${baseKey}-${variant}.webp`,
            })
          )
        );
      })
    );

    const mediaIds = mediaList.map(media => media.id);
    await MediaQueries.deleteMediaListByIds(mediaIds);

    return NextResponse.json({ deleted: mediaList.length });
  } catch (error) {
    console.error('파일 정리에 실패했습니다', error);

    return NextResponse.json(
      { error: '파일 정리에 실패했습니다' },
      { status: 500 }
    );
  }
}
