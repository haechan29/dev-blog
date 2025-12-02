'use client';

import CreateSeriesButton from '@/components/series/createSeriesButton';
import SeriesPreview from '@/components/series/seriesPreview';
import useSeries from '@/features/series/domain/hooks/useSeries';
import { SeriesProps } from '@/features/series/ui/seriesProps';

export default function SeriesPageClient({
  userId,
  currentUserId,
  initialSeriesList,
}: {
  userId: string;
  currentUserId: string | null;
  initialSeriesList: SeriesProps[];
}) {
  const { seriesList } = useSeries(userId, initialSeriesList);

  return (
    <div>
      {userId === currentUserId && (
        <div className='mb-6'>
          <CreateSeriesButton userId={userId} />
        </div>
      )}

      {seriesList && seriesList.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          시리즈가 없습니다.
        </div>
      ) : (
        <div className='flex flex-col'>
          {seriesList?.map((series, index) => (
            <div key={series.id} className='mb-8'>
              <SeriesPreview
                userId={userId}
                currentUserId={currentUserId}
                series={series}
              />
              {index !== seriesList.length - 1 && (
                <div className='h-px bg-gray-200' />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
