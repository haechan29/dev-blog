import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { CommentCursor } from '@/features/comment/data/types/commentCursor';
import * as RankedCommentUsecase from '@/features/comment/data/usecases/rankedCommentUsecase';
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
  comments: CommentResponseDto[];
  nextCursor: CommentCursor | null;
}> {
  return await RankedCommentUsecase.getRankedComments({
    postId,
    userId,
    timestamp,
  });
}
