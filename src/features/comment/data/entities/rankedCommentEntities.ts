import * as RankedCommentQueries from '@/features/comment/data/queries/rankedCommentQueries';

export type RankedCommentEntity = Awaited<
  Awaited<ReturnType<typeof RankedCommentQueries.fetchRankedComments>>[number]
>;
