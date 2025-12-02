import * as SeriesQueries from '@/features/series/data/queries/seriesQueries';
import 'server-only';

export async function fetchSeries(seriesId: string) {
  return await SeriesQueries.fetchSeries(seriesId);
}

export async function fetchSeriesByUserId(userId: string) {
  return await SeriesQueries.fetchSeriesByUserId(userId);
}
