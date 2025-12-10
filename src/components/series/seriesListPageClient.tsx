'use client';

import SeriesFormDialog from '@/components/series/seriesFormDialog';
import SeriesPreview from '@/components/series/seriesPreview';
import useSeriesList from '@/features/series/domain/hooks/useSeriesList';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function SeriesListPageClient({
  userId,
  currentUserId,
  initialSeriesList,
}: {
  userId: string;
  currentUserId?: string;
  initialSeriesList: SeriesProps[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { seriesList } = useSeriesList(userId, initialSeriesList);

  return (
    <div>
      {seriesList && seriesList.length === 0 ? (
        <div className='text-center pt-20 text-gray-500'>
          시리즈가 없습니다.
        </div>
      ) : (
        <div className='flex flex-col'>
          {seriesList?.map((series, index) => (
            <div key={series.id} className='mb-8'>
              <SeriesPreview series={series} />
              {index !== seriesList.length - 1 && (
                <div className='h-px bg-gray-200' />
              )}
            </div>
          ))}
        </div>
      )}

      {userId === currentUserId && (
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className='mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 transition-colors font-medium mx-auto'
        >
          <Plus className='w-5 h-5' />
          <div>시리즈 만들기</div>
        </button>
      )}

      {userId === currentUserId && (
        <SeriesFormDialog
          mode='create'
          userId={userId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}
