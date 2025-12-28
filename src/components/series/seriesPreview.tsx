import { SeriesProps } from '@/features/series/ui/seriesProps';
import clsx from 'clsx';
import Link from 'next/link';

export default function SeriesPreview({ series }: { series: SeriesProps }) {
  return (
    <div className='relative flex flex-col group mb-8'>
      <div
        className={clsx(
          'absolute -inset-x-6 -inset-y-4 -z-50 rounded-xl bg-gray-100/50',
          'transition-opacity|transform duration-300 ease-in-out',
          'scale-90 group-hover:scale-100 origin-center',
          'opacity-0 group-hover:opacity-100'
        )}
      />

      <Link
        href={`/series/${series.id}`}
        className='w-full flex flex-col gap-4 text-gray-900'
      >
        <div className='text-2xl font-semibold line-clamp-2'>
          {series.title}
        </div>

        {series.description && (
          <div className='text-gray-600 line-clamp-3 whitespace-pre-wrap break-keep wrap-anywhere'>
            {series.description}
          </div>
        )}

        <div className='flex gap-2 items-center text-xs text-gray-500'>
          <div>글 {series.postCount}개</div>
          <Divider />
          <div>{series.updatedAt}</div>
        </div>
      </Link>
    </div>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-500' />;
}
