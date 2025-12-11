'use client';

import usePosts from '@/features/post/hooks/usePosts';
import { PostProps } from '@/features/post/ui/postProps';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function PostSeriesNav({
  post: { userId, seriesId, seriesOrder, seriesTitle },
}: {
  post: PostProps;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { posts } = usePosts(userId);

  const next = useMemo(() => {
    if (!posts || seriesOrder === null) return null;
    return (
      posts.find(
        post =>
          post.seriesId === seriesId && post.seriesOrder === seriesOrder + 1
      ) ?? null
    );
  }, [posts, seriesId, seriesOrder]);

  return (
    next &&
    seriesTitle &&
    seriesOrder !== null && (
      <div className='mb-16'>
        <button
          onClick={() => {
            dispatch(setIsVisible(true));
          }}
          className={clsx(
            'text-xs text-gray-400 mb-3',
            'max-xl:hover:text-blue-600 max-xl:cursor-pointer',
            'xl:pointer-events-none'
          )}
        >
          {seriesTitle} · {seriesOrder + 1}편
        </button>

        <Link
          href={`/read/${next.id}`}
          className='block p-4 rounded-lg border border-gray-200 hover:bg-gray-50'
        >
          <div className='text-xs text-gray-500 mb-1 flex items-center gap-1'>
            <div>다음 글</div>
            <ArrowRight className='w-3 h-3' />
          </div>
          <div className='text-sm text-gray-900 line-clamp-1'>{next.title}</div>
        </Link>
      </div>
    )
  );
}
