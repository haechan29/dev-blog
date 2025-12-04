import { auth } from '@/auth';
import SeriesSettingsDropdown from '@/components/series/seriesSettingsDropdown';
import * as SeriesServerService from '@/features/series/domain/service/seriesServerService';
import { createProps } from '@/features/series/ui/seriesProps';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';

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

      {series.posts.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          시리즈에 포함된 글이 없습니다
        </div>
      ) : (
        <div className='flex flex-col gap-8'>
          {series.posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className='relative flex items-start gap-4 group p-4 -m-4 rounded-xl hover:bg-gray-100/50 transition-colors'
            >
              <div className='text-xl font-semibold text-gray-300 group-hover:text-gray-400 min-w-8 mt-0.5'>
                {index + 1}
              </div>
              <div className='flex-1 flex flex-col gap-2'>
                <div className='text-xl font-semibold text-gray-900 line-clamp-2'>
                  {post.title}
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <div>2024.12.01</div>
                  <Divider />
                  <div>조회 123</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-500' />;
}
