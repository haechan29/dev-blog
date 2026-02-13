import { checkQuota } from '@/features/media/data/lib/quota';
import { uploadToR2 } from '@/features/media/data/lib/upload';
import * as MediaQueries from '@/features/media/data/queries/mediaQueries';
import { nanoid } from 'nanoid';
import sharp from 'sharp';

const SMALL_IMAGE_SIZE = 128;

export async function uploadPostImage({
  file,
  userId,
}: {
  file: File;
  userId: string;
}) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await optimizeImage(buffer);

  const totalSize =
    optimized.small.length +
    optimized.medium.length +
    optimized.original.length;

  await checkQuota(userId, totalSize);

  const baseId = nanoid();

  const [smallUrl, mediumUrl, originalUrl] = await Promise.all([
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
    url: originalUrl,
    sizeBytes: totalSize,
    userId,
    type: 'image',
  });

  return {
    small: smallUrl,
    medium: mediumUrl,
    original: originalUrl,
  };
}

export async function uploadAvatarImage({
  file,
  userId,
}: {
  file: File;
  userId: string;
}): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const optimized = await sharp(buffer)
    .rotate()
    .resize(SMALL_IMAGE_SIZE, SMALL_IMAGE_SIZE, {
      fit: 'cover',
    })
    .webp({ quality: 80 })
    .toBuffer();

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
  });

  return url;
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

  const optimized = await sharp(buffer)
    .rotate()
    .resize(SMALL_IMAGE_SIZE, SMALL_IMAGE_SIZE, {
      fit: 'cover',
    })
    .webp({ quality: 80 })
    .toBuffer();

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

async function optimizeImage(inputBuffer: Buffer): Promise<{
  small: Buffer;
  medium: Buffer;
  original: Buffer;
}> {
  const normalized = sharp(inputBuffer).rotate();

  const baseOptions = {
    quality: 80,
    effort: 4,
  };

  const [small, medium, original] = await Promise.all([
    normalized
      .clone()
      .resize(800, null, { withoutEnlargement: true })
      .webp(baseOptions)
      .toBuffer(),
    normalized
      .clone()
      .resize(1200, null, { withoutEnlargement: true })
      .webp(baseOptions)
      .toBuffer(),
    normalized.clone().webp(baseOptions).toBuffer(),
  ]);

  return { small, medium, original };
}
