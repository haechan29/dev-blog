import * as ProfileQueries from '@/features/user/data/queries/profileQueries';
import { r2Client } from '@/lib/r2';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function deleteProfileMedia(userId: string): Promise<void> {
  const mediaList = await ProfileQueries.getMediaByProfileUserId(userId);

  if (mediaList.length === 0) return;

  await Promise.all(
    mediaList.map(media => {
      const key = media.url.replace(`${process.env.R2_PUBLIC_URL}/`, '');
      return r2Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
        })
      );
    })
  );

  await ProfileQueries.deleteMediaByProfileUserId(userId);
}
