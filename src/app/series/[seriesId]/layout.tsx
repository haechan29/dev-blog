import UserToolbar from '@/components/user/userToolbar';
import * as SeriesServerService from '@/features/series/domain/service/seriesServerService';
import { createProps } from '@/features/series/ui/seriesProps';
import { ReactNode } from 'react';

export default async function SeriesLayout({
  params,
  children,
}: {
  params: Promise<{ seriesId: string }>;
  children: ReactNode;
}) {
  const { seriesId } = await params;
  const series = await SeriesServerService.fetchSeries(seriesId).then(
    createProps
  );

  return (
    <>
      <UserToolbar />

      <div className='pt-(--toolbar-height) pb-20 px-6 md:px-12'>
        {children}
      </div>
    </>
  );
}
