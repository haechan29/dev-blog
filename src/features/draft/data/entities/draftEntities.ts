import * as DraftQueries from '@/features/draft/data/queries/draftQueries';

export type DraftEntity = Awaited<
  ReturnType<typeof DraftQueries.fetchDraftsByUserId>
>[number];
