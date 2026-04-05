import * as RankedCommentQueries from '@/features/comment/data/queries/rankedCommentQueries';
import 'server-only';

export async function getRankedComments(postId: string, userId?: string) {
  return await RankedCommentQueries.fetchRankedComments({ postId, userId });
}
