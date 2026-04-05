import * as CommentClientRepository from '@/features/comment/data/repository/commentClientRepository';
import { toDomain } from '@/features/comment/domain/mapper/commentMapper';
import { Comment } from '@/features/comment/domain/model/comment';
import { CommentCursor } from '@/features/comment/domain/types/page';

export async function getRankedComments({
  postId,
  timestamp,
  cursor,
}: {
  postId: string;
  timestamp: string;
  cursor?: CommentCursor | null;
}): Promise<{
  comments: Comment[];
  nextCursor: CommentCursor | null;
}> {
  const page = await CommentClientRepository.getRankedComments(
    postId,
    timestamp,
    cursor
  );
  return {
    comments: page.comments.map(comment => toDomain(comment)),
    nextCursor: page.nextCursor,
  };
}

export async function createComment(params: {
  postId: string;
  content: string;
  password?: string;
}): Promise<Comment> {
  const comment = await CommentClientRepository.createComment(params);
  return toDomain(comment);
}

export async function updateComment(params: {
  postId: string;
  commentId: number;
  content: string;
  password?: string;
}): Promise<Comment> {
  const comment = await CommentClientRepository.updateComment(params);
  return toDomain(comment);
}

export async function deleteComment(
  postId: string,
  commentId: number,
  password?: string
): Promise<void> {
  await CommentClientRepository.deleteComment(postId, commentId, password);
}

export async function incrementLikeCount(
  postId: string,
  commentId: number
): Promise<Comment> {
  const dto = await CommentClientRepository.incrementLikeCount(
    postId,
    commentId
  );
  return toDomain(dto);
}

export async function decrementLikeCount(
  postId: string,
  commentId: number
): Promise<Comment> {
  const dto = await CommentClientRepository.decrementLikeCount(
    postId,
    commentId
  );
  return toDomain(dto);
}
