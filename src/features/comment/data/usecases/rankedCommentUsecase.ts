import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { toDto } from '@/features/comment/data/mapper/rankedCommentMapper';
import * as RankedCommentQueries from '@/features/comment/data/queries/rankedCommentQueries';
import { CommentCursor } from '@/features/comment/domain/types/page';
import 'server-only';

const COMMENT_LIMIT = 5;

export async function getRankedComments({
  postId,
  userId,
  timestamp,
  cursorScore,
  cursorId,
}: {
  postId: string;
  userId?: string;
  timestamp?: string;
  cursorScore?: number;
  cursorId?: number;
}): Promise<{
  comments: CommentResponseDto[];
  nextCursor: CommentCursor | null;
}> {
  const fetchedComments = await RankedCommentQueries.fetchRankedComments({
    postId,
    userId,
    timestamp,
    limit: COMMENT_LIMIT + 1,
    cursorScore,
    cursorId,
  });

  const slicedComments = fetchedComments.slice(0, COMMENT_LIMIT);

  const isLastPage = fetchedComments.length <= COMMENT_LIMIT;
  const lastComment = slicedComments.at(-1);

  const nextCursor =
    isLastPage || lastComment === undefined
      ? null
      : { score: lastComment.score, id: String(lastComment.id) };

  return { comments: slicedComments.map(toDto), nextCursor };
}
