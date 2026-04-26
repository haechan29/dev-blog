import * as CreatorQueries from '@/features/creator/data/queries/creatorQueries';

export type CreatorEntity = Awaited<
  ReturnType<typeof CreatorQueries.fetchCreator>
>;
