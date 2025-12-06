'use client';

import AddPostDialog from '@/components/series/addPostDialog';
import SeriesPostList from '@/components/series/seriesPostList';
import SeriesSettingsDropdown from '@/components/series/seriesSettingsDropdown';
import useSeries from '@/features/series/domain/hooks/useSeries';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import { MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';

export default function SeriesPageClient({
  userId,
  initialSeries,
}: {
  userId: string | null;
  initialSeries: SeriesProps;
}) {
  const { series } = useSeries(initialSeries);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

      <SeriesPostList userId={userId} initialSeries={series} />

      {userId === series.userId && (
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className='mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 transition-colors font-medium mx-auto'
        >
          <Plus className='w-5 h-5' />
          <div>글 추가</div>
        </button>
      )}

      {userId === series.userId && (
        <AddPostDialog
          initialSeries={series}
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
        />
      )}
    </>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-500' />;
}
