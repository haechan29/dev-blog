import SeriesPageClient from '@/components/series/seriesPageClient';
import * as SeriesServerRepository from '@/features/series/data/repository/seriesServerRepository';
import { toProps } from '@/features/series/ui/mapper/seriesMapper';
import { getUserId } from '@/lib/user';

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const userId = await getUserId();

  const { seriesId } = await params;
  const series =
    await SeriesServerRepository.fetchSeries(seriesId).then(toProps);

  return <SeriesPageClient userId={userId} initialSeries={series} />;
}
