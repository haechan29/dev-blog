import { r2Client } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

interface UploadParams {
  key: string;
  body: Buffer;
  contentType: string;
}

export async function uploadToR2({ key, body, contentType }: UploadParams) {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
