import { Series } from '@/features/series/domain/model/series';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function SeriesPreview({
  userId,
  currentUserId,
  series,
}: {
  userId: string;
  currentUserId: string | null;
  series: Series;
}) {
  return (
    <div className='relative flex flex-col group mb-8'>
      {/* 호버 배경 */}
      <div
        className={clsx(
          'absolute -inset-x-6 -inset-y-4 -z-50 rounded-xl bg-gray-100/50',
          'transition-opacity|transform duration-300 ease-in-out',
          'scale-90 group-hover:scale-100 origin-center',
          'opacity-0 group-hover:opacity-100'
        )}
      />

      {/* 설정 메뉴 */}
      {userId === currentUserId && (
        <div className='absolute top-0 right-0 z-10'>
          <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 hover:bg-gray-200 rounded-full p-2 -m-2 cursor-pointer' />
        </div>
      )}

      {/* 시리즈 내용 */}
      <Link
        href={`/user/${userId}/series/${series.id}`}
        className='w-full flex flex-col gap-4 text-gray-900'
      >
        <div
          className={clsx(
            'text-2xl font-semibold line-clamp-2',
            userId === currentUserId ? 'w-[calc(100%-3rem)]' : 'w-full'
          )}
        >
          {series.title}
        </div>

        {series.description && (
          <div className='text-gray-600 line-clamp-3 whitespace-pre-wrap break-keep'>
            {series.description}
          </div>
        )}

        <div className='text-sm text-gray-500'>
          글 {series.postCount}개 · 최근 업데이트:{' '}
          {new Date(series.updatedAt).toLocaleDateString('ko-KR')}
        </div>
      </Link>
    </div>
  );
}
