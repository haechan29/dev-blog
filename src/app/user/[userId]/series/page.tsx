import SeriesListPageClient from '@/components/series/seriesListPageClient';
import * as SeriesServerRepository from '@/features/series/data/repository/seriesServerRepository';
import { toProps } from '@/features/series/ui/mapper/seriesMapper';
import { getUserId } from '@/lib/user';

export default async function SeriesListPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const currentUserId = await getUserId();

  const seriesList = await SeriesServerRepository.fetchSeriesByUserId(
    userId
  ).then(seriesList => seriesList.map(toProps));

  return (
    <SeriesListPageClient
      userId={userId}
      currentUserId={currentUserId}
      initialSeriesList={seriesList}
    />
  );
}
