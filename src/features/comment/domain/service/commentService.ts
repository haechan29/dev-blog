import { Comment } from '@/features/comment/domain/model/comment';
import * as CommentRepository from '@/features/comment/data/repository/commentRepository';
import { toDomain } from '@/features/comment/domain/mapper/commentMapper';

export async function getComments(postId: string): Promise<Comment[]> {
  const comments = await CommentRepository.getComments(postId);
  return comments.map(comment => toDomain(comment));
}

export async function createComment(params: {
  postId: string;
  authorName: string;
  content: string;
  password: string;
}): Promise<Comment> {
  const comment = await CommentRepository.createComment(params);
  return toDomain(comment);
}

export async function updateComment(params: {
  postId: string;
  commentId: number;
  content: string;
  password: string;
}): Promise<Comment> {
  const comment = await CommentRepository.updateComment(params);
  return toDomain(comment);
}

export async function deleteComment(
  postId: string,
  commentId: number,
  password: string
): Promise<void> {
  await CommentRepository.deleteComment(postId, commentId, password);
}
