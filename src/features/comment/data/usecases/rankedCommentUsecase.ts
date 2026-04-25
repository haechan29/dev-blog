import { ValidationError } from '@/errors/errors';
import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import * as CommentMapper from '@/features/comment/data/mapper/commentMapper';
import * as RankedCommentMapper from '@/features/comment/data/mapper/rankedCommentMapper';
import * as CommentQueries from '@/features/comment/data/queries/commentQueries';
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
  highlightCommentId,
}: {
  postId: string;
  userId?: string;
  timestamp?: string;
  cursorScore?: number;
  cursorId?: number;
  highlightCommentId?: number;
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

  const isFirstPage = cursorScore == null && cursorId == null;
  let highlightCommentDto: CommentResponseDto | undefined;
  let slicedComments = fetchedComments.slice(0, COMMENT_LIMIT);

  if (isFirstPage && highlightCommentId !== undefined) {
    const highlightComment = slicedComments.find(
      c => c.id === highlightCommentId
    );

    if (!!highlightComment) {
      highlightCommentDto = RankedCommentMapper.toDto(highlightComment);
    } else {
      const highlightComment =
        await CommentQueries.fetchComment(highlightCommentId);
      if (highlightComment.postId !== postId) {
        throw new ValidationError('댓글이 속한 게시글이 일치하지 않습니다');
      }
      highlightCommentDto = CommentMapper.toDto(highlightComment);
    }

    slicedComments = slicedComments
      .filter(c => c.id !== highlightCommentId)
      .slice(0, COMMENT_LIMIT - 1);
  }

  const comments =
    highlightCommentDto !== undefined
      ? [highlightCommentDto, ...slicedComments.map(RankedCommentMapper.toDto)]
      : slicedComments.map(RankedCommentMapper.toDto);

  const isLastPage = fetchedComments.length <= COMMENT_LIMIT;
  const lastComment = slicedComments.at(-1);

  const nextCursor =
    isLastPage || lastComment === undefined
      ? null
      : { score: lastComment.score, id: String(lastComment.id) };

  return { comments, nextCursor };
}
