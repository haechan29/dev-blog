import * as PostQueries from '@/features/post/data/queries/postQueries';

export type PostEntity = Awaited<
  ReturnType<typeof PostQueries.fetchPostsByUserId>
>[number];
