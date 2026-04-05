import * as CommentServerRepository from '@/features/comment/data/repository/commentServerRepository';
import { toDomain } from '@/features/comment/domain/mapper/commentMapper';
import { Comment } from '@/features/comment/domain/model/comment';
import 'server-only';

export async function getRankedComments(
  postId: string,
  userId?: string
): Promise<Comment[]> {
  const comments = await CommentServerRepository.getRankedComments(
    postId,
    userId
  );
  return comments.map(comment => toDomain(comment));
}
