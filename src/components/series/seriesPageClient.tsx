'use client';

import CreateSeriesButton from '@/components/series/createSeriesButton';
import useSeries from '@/features/series/domain/hooks/useSeries';
import { Series } from '@/features/series/domain/model/series';

export default function SeriesListClient({
  userId,
  currentUserId,
  initialSeriesList,
}: {
  userId: string;
  currentUserId: string | null;
  initialSeriesList: Series[];
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
        <div className='flex flex-col gap-8'>
          {seriesList?.map(series => (
            <div key={series.id}>
              <div className='text-xl font-semibold'>{series.title}</div>
              {series.description && (
                <div className='text-gray-600 mt-2'>{series.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
