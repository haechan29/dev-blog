import * as CommentServerRepository from '@/features/comment/data/repository/commentServerRepository';
import { toDomain } from '@/features/comment/domain/mapper/commentMapper';
import { Comment } from '@/features/comment/domain/model/comment';
import 'server-only';

export async function getComments(postId: string): Promise<Comment[]> {
  const comments = await CommentServerRepository.getComments(postId);
  return comments
    .map(comment => toDomain(comment))
    .sort((a: Comment, b: Comment) => {
      if (a.likeCount > b.likeCount) return -1;
      else if (a.likeCount < b.likeCount) return 1;
      return a.createdAt > b.createdAt ? 1 : -1;
    });
}
