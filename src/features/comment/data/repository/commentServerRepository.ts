import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import * as RankedCommentUsecase from '@/features/comment/data/usecases/rankedCommentUsecase';
import { CommentCursor } from '@/features/comment/ui/types/page';
import 'server-only';

export async function getRankedComments({
  postId,
  userId,
  timestamp,
  highlightCommentId,
}: {
  postId: string;
  userId?: string;
  timestamp: string;
  highlightCommentId?: number;
}): Promise<{
  comments: CommentResponseDto[];
  nextCursor: CommentCursor | null;
}> {
  return await RankedCommentUsecase.getRankedComments({
    postId,
    userId,
    timestamp,
    highlightCommentId,
  });
}
