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

  const isOwner = userId === series.userId;

  return (
    <div className='max-w-3xl mx-auto'>
      {/* 시리즈 헤더 */}
      <header className='mb-16'>
        <div className='flex justify-between items-start mb-6'>
          <h1 className='text-4xl font-bold'>{series.title}</h1>
          {isOwner && (
            <SeriesSettingsDropdown userId={userId} series={series}>
              <MoreVertical className='w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer' />
            </SeriesSettingsDropdown>
          )}
        </div>

        {series.description && (
          <p className='text-lg text-gray-600 mb-6 whitespace-pre-wrap'>
            {series.description}
          </p>
        )}

        <div className='flex items-center gap-3 text-sm text-gray-500'>
          <span className='font-medium text-gray-900'>{series.authorName}</span>
          <span>·</span>
          <span>{series.postCount}개의 글</span>
          <span>·</span>
          <span>{series.updatedAt}</span>
        </div>
      </header>

      {/* 글 목록 */}
      <div className='space-y-1'>
        {series.posts.length === 0 ? (
          <p className='text-center py-20 text-gray-400'>
            아직 작성된 글이 없습니다
          </p>
        ) : (
          series.posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className='flex items-center gap-5 p-4 rounded-lg hover:bg-gray-50 transition-colors group'
            >
              <span className='text-2xl font-bold text-gray-300 group-hover:text-gray-400 w-10 text-right'>
                {index + 1}
              </span>
              <span className='text-lg flex-1 group-hover:text-blue-600'>
                {post.title}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
