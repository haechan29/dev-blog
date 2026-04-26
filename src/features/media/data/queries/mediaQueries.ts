import { db } from '@/db/index';
import { media } from '@/db/schema';
import { and, eq, gte, inArray, sql } from 'drizzle-orm';
import 'server-only';

export async function fetchMediaUrlsByIds(ids: string[]) {
  if (ids.length === 0) {
    return new Map<string, string>();
  }

  const data = await db
    .select({
      id: media.id,
      url: media.url,
    })
    .from(media)
    .where(inArray(media.id, ids));

  const map = new Map<string, string>();
  for (const { id, url } of data) {
    if (id != null && url != null) {
      map.set(id, url);
    }
  }

  return map;
}

export async function getUsageSince(userId: string, since: Date) {
  const [usage] = await db
    .select({
      totalSizeBytes: sql<number>`coalesce(sum(${media.sizeBytes}), 0)::int`,
    })
    .from(media)
    .where(
      and(eq(media.userId, userId), gte(media.createdAt, since.toISOString()))
    );

  return usage?.totalSizeBytes ?? 0;
}

export async function createMedia({
  url,
  sizeBytes,
  userId,
  type,
}: {
  url: string;
  sizeBytes: number;
  userId: string;
  type: 'image' | 'audio';
}) {
  const [createdMedia] = await db
    .insert(media)
    .values({
      url,
      sizeBytes,
      userId,
      type,
    })
    .returning({ id: media.id });

  if (!createdMedia) {
    throw new Error('미디어 생성에 실패했습니다');
  }

  return createdMedia.id;
}
