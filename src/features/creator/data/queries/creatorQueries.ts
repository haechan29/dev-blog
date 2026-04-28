import { db } from '@/db/index';
import { creators } from '@/db/schema';
import { CreatorEntity } from '@/features/creator/data/entities/creatorEntities';
import { desc, eq } from 'drizzle-orm';
import 'server-only';

const CREATOR_SELECT_FIELDS = {
  id: creators.id,
  channelName: creators.channelName,
  email: creators.email,
  memo: creators.memo,
  status: creators.status,
  createdAt: creators.createdAt,
  lastMailedAt: creators.lastMailedAt,
  userId: creators.userId,
} as const;

export async function fetchCreators() {
  const data = await db
    .select(CREATOR_SELECT_FIELDS)
    .from(creators)
    .orderBy(desc(creators.lastMailedAt));

  const sorted = data.sort((a, b) => {
    if (a.status === 'rejected' && b.status !== 'rejected') return 1;
    if (a.status !== 'rejected' && b.status === 'rejected') return -1;
    return 0;
  });

  return sorted;
}

export async function fetchCreator(id: string) {
  const creator = await db
    .select(CREATOR_SELECT_FIELDS)
    .from(creators)
    .where(eq(creators.id, id))
    .limit(1);

  return creator[0] ?? null;
}

export async function createCreator({
  channelName,
  email,
  memo,
  userId,
}: {
  channelName: string;
  email: string;
  memo?: string;
  userId: string;
}) {
  const [creator] = await db
    .insert(creators)
    .values({
      channelName,
      email,
      memo: memo ?? null,
      userId,
    })
    .returning(CREATOR_SELECT_FIELDS);

  if (!creator) {
    throw new Error('크리에이터 생성에 실패했습니다');
  }

  return creator;
}

export async function updateCreator({
  id,
  channelName,
  email,
  memo,
  status,
}: {
  id: string;
  channelName?: string;
  email?: string;
  memo?: string | null;
  status?: CreatorEntity['status'];
}) {
  const updates: Partial<CreatorEntity> = {
    ...(channelName !== undefined && { channelName }),
    ...(email !== undefined && { email }),
    ...(memo !== undefined && { memo }),
    ...(status !== undefined && { status }),
  };

  const [creator] = await db
    .update(creators)
    .set(updates)
    .where(eq(creators.id, id))
    .returning(CREATOR_SELECT_FIELDS);

  if (!creator) {
    throw new Error('크리에이터 업데이트에 실패했습니다');
  }

  return creator;
}

export async function updateLastMailedAt(id: string, timestamp: string) {
  await db
    .update(creators)
    .set({ lastMailedAt: timestamp })
    .where(eq(creators.id, id));
}

export async function deleteCreator(id: string) {
  await db.delete(creators).where(eq(creators.id, id));
}

export async function fetchCreatorByUserId(userId: string) {
  const data = await db
    .select(CREATOR_SELECT_FIELDS)
    .from(creators)
    .where(eq(creators.userId, userId))
    .limit(1);

  return data[0] ?? null;
}
