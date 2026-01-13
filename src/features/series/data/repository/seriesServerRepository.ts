import * as SeriesUsecase from '@/features/series/data/usecases/seriesUsecase';
import 'server-only';

export async function fetchSeries(seriesId: string) {
  return await SeriesUsecase.getSeries(seriesId);
}

export async function fetchSeriesByUserId(userId: string) {
  return await SeriesUsecase.getSeriesByUserId(userId);
}
