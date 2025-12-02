import { auth } from '@/auth';
import SeriesPageClient from '@/components/series/seriesPageClient';
import * as SeriesServerService from '@/features/series/domain/service/seriesServerService';

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await auth();
  const seriesList = await SeriesServerService.fetchSeriesByUserId(userId);

  return (
    <SeriesPageClient
      userId={userId}
      currentUserId={session?.user?.id ?? null}
      initialSeriesList={seriesList}
    />
  );
}
