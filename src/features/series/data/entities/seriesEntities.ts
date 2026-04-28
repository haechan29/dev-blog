import type * as SeriesQueries from '@/features/series/data/queries/seriesQueries';

export type SeriesEntity = Awaited<
  ReturnType<typeof SeriesQueries.fetchSeries>
>;
