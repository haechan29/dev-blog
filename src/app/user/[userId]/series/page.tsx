import * as SeriesServerService from '@/features/series/domain/service/seriesServerService';

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const seriesList = await SeriesServerService.fetchSeriesByUserId(userId);

  return seriesList.length === 0 ? (
    <div className='text-center py-20 text-gray-500'>시리즈가 없습니다.</div>
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
  );
}
