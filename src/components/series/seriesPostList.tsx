'use client';

import usePostStat from '@/features/postStat/hooks/usePostStat';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import Link from 'next/link';

export default function SeriesPostList({ series }: { series: SeriesProps }) {
  return (
    <>
      {series.posts.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          시리즈에 포함된 글이 없습니다
        </div>
      ) : (
        <div className='flex flex-col gap-8'>
          {series.posts.map((post, index) => (
            <SeriesPost key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </>
  );
}

function SeriesPost({
  post,
  index,
}: {
  post: SeriesProps['posts'][number];
  index: number;
}) {
  const {
    stat: { viewCount },
  } = usePostStat({ postId: post.id });

  return (
    <Link
      href={`/read/${post.id}`}
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
          <div>{post.createdAt}</div>
          <Divider />
          <div>조회 {viewCount}</div>
        </div>
      </div>
    </Link>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-500' />;
}
