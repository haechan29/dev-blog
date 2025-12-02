import { auth } from '@/auth';
import CreateSeriesButton from '@/components/series/createSeriesButton';
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
    <div>
      {session?.user?.id === userId && (
        <div className='mb-6'>
          <CreateSeriesButton userId={userId} />
        </div>
      )}

      {seriesList.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          시리즈가 없습니다.
        </div>
      ) : (
        <div className='flex flex-col gap-8'>
          {seriesList.map(series => (
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
