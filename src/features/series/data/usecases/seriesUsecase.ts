import { toDto } from '@/features/series/data/mapper/seriesMapper';
import * as SeriesQueries from '@/features/series/data/queries/seriesQueries';
import { getUserId } from '@/lib/user';

export async function getSeries(seriesId: string) {
  const currentUserId = await getUserId();
  const series = await SeriesQueries.fetchSeries(seriesId);

  if (currentUserId !== series.user_id) {
    series.posts = series.posts.filter(post => !post.is_private);
  }

  return toDto(series);
}

export async function getSeriesByUserId(userId: string) {
  const currentUserId = await getUserId();
  const seriesList = await SeriesQueries.fetchSeriesByUserId(userId);

  if (currentUserId !== userId) {
    seriesList.forEach(series => {
      series.posts = series.posts.filter(post => !post.is_private);
    });
  }

  return seriesList.map(toDto);
}
