import { auth } from '@/auth';
import SeriesPageClient from '@/components/series/seriesPageClient';
import * as SeriesServerService from '@/features/series/domain/service/seriesServerService';
import { createProps } from '@/features/series/ui/seriesProps';

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const { seriesId } = await params;
  const series = await SeriesServerService.fetchSeries(seriesId).then(
    createProps
  );

  return <SeriesPageClient userId={userId} initialSeries={series} />;
}
