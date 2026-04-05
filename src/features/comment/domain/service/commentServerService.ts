import * as CommentServerRepository from '@/features/comment/data/repository/commentServerRepository';
import { CommentCursor } from '@/features/comment/data/types/commentCursor';
import { toDomain } from '@/features/comment/domain/mapper/commentMapper';
import { Comment } from '@/features/comment/domain/model/comment';
import 'server-only';

export async function getRankedComments({
  postId,
  userId,
  timestamp,
}: {
  postId: string;
  userId?: string;
  timestamp: string;
}): Promise<{
  comments: Comment[];
  nextCursor: CommentCursor | null;
}> {
  const page = await CommentServerRepository.getRankedComments({
    postId,
    userId,
    timestamp,
  });
  return {
    comments: page.comments.map(toDomain),
    nextCursor: page.nextCursor,
  };
}
