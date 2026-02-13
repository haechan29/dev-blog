import {
  optimizePostImage,
  optimizeProfileImage,
} from '@/features/media/data/lib/optimize-image';
import { checkQuota } from '@/features/media/data/lib/quota';
import { uploadToR2 } from '@/features/media/data/lib/upload';
import * as MediaQueries from '@/features/media/data/queries/mediaQueries';
import { nanoid } from 'nanoid';

export async function uploadPostImage({
  file,
  userId,
}: {
  file: File;
  userId: string;
}): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await optimizePostImage(buffer);

  const totalSize =
    optimized.small.length +
    optimized.medium.length +
    optimized.original.length;

  await checkQuota(userId, totalSize);

  const baseId = nanoid();

  await Promise.all([
    uploadToR2({
      key: `${baseId}-800.webp`,
      body: optimized.small,
      contentType: 'image/webp',
    }),
    uploadToR2({
      key: `${baseId}-1200.webp`,
      body: optimized.medium,
      contentType: 'image/webp',
    }),
    uploadToR2({
      key: `${baseId}-original.webp`,
      body: optimized.original,
      contentType: 'image/webp',
    }),
  ]);

  await MediaQueries.createMedia({
    url: `${process.env.R2_PUBLIC_URL!}/${baseId}-original.webp`,
    sizeBytes: totalSize,
    userId,
    type: 'image',
  });

  return `${process.env.R2_PUBLIC_URL!}/${baseId}`;
}

export async function uploadAvatarImage({
  file,
  userId,
}: {
  file: File;
  userId: string;
}): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const optimized = await optimizeProfileImage(buffer);

  await checkQuota(userId, optimized.length);

  const baseId = nanoid();

  await uploadToR2({
    key: `${baseId}-120.webp`,
    body: optimized,
    contentType: 'image/webp',
  });

  await MediaQueries.createMedia({
    url: `${process.env.R2_PUBLIC_URL!}/${baseId}-120.webp`,
    sizeBytes: optimized.length,
    userId,
    type: 'image',
  });

  return `${process.env.R2_PUBLIC_URL!}/${baseId}`;
}

export async function uploadProfileImage({
  file,
  userId,
  profileUserId,
}: {
  file: File;
  userId: string;
  profileUserId: string;
}): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const optimized = await optimizeProfileImage(buffer);

  await checkQuota(userId, optimized.length);

  const key = `${nanoid()}.webp`;
  const url = await uploadToR2({
    key,
    body: optimized,
    contentType: 'image/webp',
  });

  await MediaQueries.createMedia({
    url,
    sizeBytes: optimized.length,
    userId,
    type: 'image',
    profileUserId,
  });

  return url;
}

export async function uploadAudio({
  file,
  userId,
}: {
  file: File;
  userId: string;
}): Promise<string> {
  await checkQuota(userId, file.size);

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type.split('/')[1];
  const key = `${nanoid()}.${ext}`;

  const url = await uploadToR2({
    key,
    body: buffer,
    contentType: file.type,
  });

  await MediaQueries.createMedia({
    url,
    sizeBytes: file.size,
    userId,
    type: 'audio',
  });

  return url;
}
