import * as CommentServerRepository from '@/features/comment/data/repository/commentServerRepository';
import { toDomain } from '@/features/comment/domain/mapper/commentMapper';
import { Comment } from '@/features/comment/domain/model/comment';
import 'server-only';

export async function getComments(
  postId: string,
  userId?: string
): Promise<Comment[]> {
  const comments = await CommentServerRepository.getComments(postId, userId);
  return comments.map(comment => toDomain(comment));
}
