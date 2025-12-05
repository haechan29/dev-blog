import { auth } from '@/auth';
import SeriesListPageClient from '@/components/series/seriesListPageClient';
import * as SeriesServerService from '@/features/series/domain/service/seriesServerService';
import { createProps } from '@/features/series/ui/seriesProps';

export default async function SeriesListPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await auth();
  const seriesList = await SeriesServerService.fetchSeriesByUserId(userId).then(
    seriesList => seriesList.map(createProps)
  );

  return (
    <SeriesListPageClient
      userId={userId}
      currentUserId={session?.user?.id ?? null}
      initialSeriesList={seriesList}
    />
  );
}
