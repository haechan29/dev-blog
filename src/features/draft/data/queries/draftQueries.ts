import { db } from '@/db/index';
import { drafts } from '@/db/schema';
import { DraftEntity } from '@/features/draft/data/entities/draftEntities';
import { desc, eq } from 'drizzle-orm';
import 'server-only';

const DRAFT_SELECT_FIELDS = {
  id: drafts.id,
  userId: drafts.userId,
  postId: drafts.postId,
  title: drafts.title,
  contentJson: drafts.contentJson,
  tags: drafts.tags,
  createdAt: drafts.createdAt,
  updatedAt: drafts.updatedAt,
} as const;

export async function fetchDraftsByUserId(userId: string) {
  const data = await db
    .select(DRAFT_SELECT_FIELDS)
    .from(drafts)
    .where(eq(drafts.userId, userId))
    .orderBy(desc(drafts.updatedAt), desc(drafts.id));

  return data;
}

export async function fetchDraftOwnership(draftId: string) {
  const data = await db
    .select({
      id: drafts.id,
      userId: drafts.userId,
    })
    .from(drafts)
    .where(eq(drafts.id, draftId))
    .limit(1);

  return data[0];
}

export async function createDraft({
  userId,
  postId,
  title,
  contentJson,
  tags,
}: {
  userId: string;
  postId: string | null;
  title: string;
  contentJson: object | null;
  tags: string[];
}) {
  const [draft] = await db
    .insert(drafts)
    .values({
      userId,
      postId,
      title,
      contentJson,
      tags,
    })
    .returning(DRAFT_SELECT_FIELDS);

  if (!draft) {
    throw new Error('임시저장 생성에 실패했습니다');
  }

  return draft;
}

export async function updateDraft({
  draftId,
  postId,
  title,
  contentJson,
  tags,
}: {
  draftId: string;
  postId?: string | null;
  title?: string;
  contentJson?: object | null;
  tags?: string[];
}) {
  const updates: Partial<DraftEntity> = {
    ...(postId !== undefined && { postId }),
    ...(title !== undefined && { title }),
    ...(contentJson !== undefined && { contentJson }),
    ...(tags !== undefined && { tags }),
    updatedAt: new Date().toISOString(),
  };

  const [draft] = await db
    .update(drafts)
    .set(updates)
    .where(eq(drafts.id, draftId))
    .returning(DRAFT_SELECT_FIELDS);

  if (!draft) {
    throw new Error('임시저장 수정에 실패했습니다');
  }

  return draft;
}

export async function deleteDraft(draftId: string) {
  await db.delete(drafts).where(eq(drafts.id, draftId));
}
