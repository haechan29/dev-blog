import * as CommentQueries from '@/features/comment/data/queries/commentQueries';

export type CommentEntity = Awaited<
  ReturnType<typeof CommentQueries.fetchComment>
>;
