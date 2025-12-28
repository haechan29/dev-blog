import * as ImageQueries from '@/features/image/data/queries/imageQueries';
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
    const images = await ImageQueries.getOrphanImages();

    await Promise.all(
      images.map(async image => {
        const key = image.url.split('/').pop();
        if (key) {
          await r2Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: key,
            })
          );
        }
      })
    );

    const imageIds = images.map(image => image.id);
    await ImageQueries.deleteImagesByIds(imageIds);

    return NextResponse.json({ deleted: images.length });
  } catch (error) {
    console.error('이미지 정리에 실패했습니다', error);

    return NextResponse.json(
      { error: '이미지 정리에 실패했습니다' },
      { status: 500 }
    );
  }
}
