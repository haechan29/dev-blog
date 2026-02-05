import {
  DailyQuotaExhaustedError,
  RateLimitError,
} from '@/features/media/data/errors/mediaErrors';
import * as MediaQueries from '@/features/media/data/queries/mediaQueries';
import { r2Client } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

const LIMIT_PER_MINUTE = 100 * 1024 * 1024; // 100MB
const DAILY_QUOTA = 1024 * 1024 * 1024; // 1GB

type MediaType = 'image' | 'audio';

export async function uploadMedia({
  file,
  userId,
  type,
  profileUserId,
}: {
  file: File;
  userId: string;
  type: MediaType;
  profileUserId?: string;
}): Promise<string> {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [usageLastMinute, usageLastDay] = await Promise.all([
    MediaQueries.getUsageSince(userId, oneMinuteAgo),
    MediaQueries.getUsageSince(userId, oneDayAgo),
  ]);

  if (usageLastMinute + file.size > LIMIT_PER_MINUTE) {
    throw new RateLimitError('1분 후에 다시 시도해주세요');
  }

  if (usageLastDay + file.size > DAILY_QUOTA) {
    console.log('일일 사용량 초과', userId);
    throw new DailyQuotaExhaustedError('오늘 사용량을 모두 사용했습니다');
  }

  const ext = file.type.split('/')[1];
  const key = `${nanoid()}.${ext}`;
  const url = `${process.env.R2_PUBLIC_URL}/${key}`;

  await MediaQueries.createMedia({
    url,
    sizeBytes: file.size,
    userId,
    type,
    profileUserId,
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

  return url;
}
