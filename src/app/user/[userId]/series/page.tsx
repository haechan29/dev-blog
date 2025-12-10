import SeriesListPageClient from '@/components/series/seriesListPageClient';
import * as SeriesServerService from '@/features/series/domain/service/seriesServerService';
import { createProps } from '@/features/series/ui/seriesProps';
import { getUserId } from '@/lib/user';

export default async function SeriesListPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const currentUserId = await getUserId();

  const seriesList = await SeriesServerService.fetchSeriesByUserId(userId).then(
    seriesList => seriesList.map(createProps)
  );

  return (
    <SeriesListPageClient
      userId={userId}
      currentUserId={currentUserId}
      initialSeriesList={seriesList}
    />
  );
}
