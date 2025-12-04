import { auth } from '@/auth';
import SeriesPostList from '@/components/series/seriesPostList';
import SeriesSettingsDropdown from '@/components/series/seriesSettingsDropdown';
import * as SeriesServerService from '@/features/series/domain/service/seriesServerService';
import { createProps } from '@/features/series/ui/seriesProps';
import { MoreVertical } from 'lucide-react';

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

  return (
    <>
      <div className='flex flex-col gap-6 mb-10'>
        <div className='flex justify-between items-start gap-4'>
          <div className='text-3xl font-bold line-clamp-2 flex-1'>
            {series.title}
          </div>
          {userId === series.userId && (
            <SeriesSettingsDropdown userId={userId} series={series}>
              <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2 cursor-pointer shrink-0' />
            </SeriesSettingsDropdown>
          )}
        </div>

        {series.description && (
          <div className='text-gray-600 whitespace-pre-wrap break-keep'>
            {series.description}
          </div>
        )}

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <div className='font-medium text-gray-900'>{series.authorName}</div>
          <Divider />
          <div>{series.updatedAt}</div>
        </div>
      </div>

      <div className='w-full h-px bg-gray-200 mb-10' />

      <SeriesPostList series={series} />
    </>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-500' />;
}
