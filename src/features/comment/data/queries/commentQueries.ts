import { db } from '@/db/index';
import { comments, users } from '@/db/schema';
import { NotFoundError } from '@/errors/errors';
import { InferInsertModel, eq } from 'drizzle-orm';
import 'server-only';

const COMMENT_FIELDS = {
  id: comments.id,
  postId: comments.postId,
  content: comments.content,
  createdAt: comments.createdAt,
  updatedAt: comments.updatedAt,
  likeCount: comments.likeCount,
  userId: comments.userId,
};

const COMMENT_USER_FIELDS = {
  nickname: users.nickname,
  deletedAt: users.deletedAt,
  registeredAt: users.registeredAt,
  profileImageUrl: users.profileImageUrl,
};

const COMMENT_SELECT_FIELDS = {
  ...COMMENT_FIELDS,
  user: COMMENT_USER_FIELDS,
} as const;

export async function fetchComment(commentId: number) {
  const data = await db
    .select(COMMENT_SELECT_FIELDS)
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.id, commentId))
    .limit(1);

  if (!data[0]) {
    throw new NotFoundError('댓글이 존재하지 않습니다');
  }

  return data[0];
}

export async function fetchCommentForAuth(commentId: number) {
  const data = await db
    .select({
      userId: comments.userId,
      passwordHash: comments.passwordHash,
    })
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1);

  if (!data[0]) {
    throw new NotFoundError('댓글을 찾을 수 없습니다');
  }

  return data[0];
}

export async function createComment(
  postId: string,
  content: string,
  passwordHash: string | null,
  userId: string
) {
  const [comment] = await db
    .insert(comments)
    .values({
      postId,
      content,
      passwordHash,
      userId,
    })
    .returning();

  if (!comment) {
    throw new NotFoundError('댓글을 찾을 수 없습니다');
  }

  return await fetchComment(comment.id);
}

export async function updateComment({
  commentId,
  content,
  likeCount,
}: {
  commentId: number;
  content?: string;
  likeCount?: number;
}) {
  const updates: Partial<InferInsertModel<typeof comments>> = {
    updatedAt: new Date().toISOString(),
    ...(content !== undefined && { content }),
    ...(likeCount !== undefined && { likeCount }),
  };

  const [comment] = await db
    .update(comments)
    .set(updates)
    .where(eq(comments.id, commentId))
    .returning({ id: comments.id });

  if (!comment) {
    throw new NotFoundError('댓글을 찾을 수 없습니다');
  }

  return await fetchComment(comment.id);
}

export async function deleteComment(commentId: number) {
  await db.delete(comments).where(eq(comments.id, commentId));
}
