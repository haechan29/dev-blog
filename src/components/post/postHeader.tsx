'use client';

import PostInfo from '@/components/post/postInfo';
import PostSettingsDropdown from '@/components/post/postSettingsDropdown';
import { PostProps } from '@/features/post/ui/postProps';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { setIsHeaderVisible } from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function PostHeader({
  isLoggedIn,
  userId,
  post,
}: {
  isLoggedIn: boolean;
  userId?: string;
  post: PostProps;
}) {
  const router = useRouterWithProgress();
  const dispatch = useDispatch<AppDispatch>();
  const { title, tags } = post;
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      entries => dispatch(setIsHeaderVisible(entries[0].isIntersecting)),
      {
        rootMargin: '0px 0px -50% 0px',
      }
    );
    const header = document.querySelector('[data-post-header]');
    if (header) {
      headerObserver.observe(header);
    }
    return () => headerObserver.disconnect();
  }, [dispatch, headerRef]);

  return (
    <div data-post-header className='flex flex-col gap-6 mb-10'>
      <div className='flex flex-col gap-2 items-start'>
        {post.seriesTitle && post.seriesOrder !== null && (
          <button
            onClick={() => {
              dispatch(setIsVisible(true));
            }}
            className={clsx(
              'text-sm text-gray-500  p-1 -m-1',
              'max-xl:hover:text-blue-600 max-xl:cursor-pointer',
              'xl:pointer-events-none'
            )}
          >
            {post.seriesTitle} · {post.seriesOrder + 1}편
          </button>
        )}
        <div className='text-3xl font-bold line-clamp-2'>{title}</div>
      </div>

      {tags.length > 0 && (
        <div className='w-full flex overflow-x-auto scrollbar-hide gap-3'>
          {tags.map((tag, index) => (
            <div
              key={tag}
              className={clsx(
                'text-xs px-2 py-1 border border-gray-300 rounded-full whitespace-nowrap',
                index >= 3 && 'max-w-20 text-ellipsis overflow-clip'
              )}
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      <div className='flex justify-between items-center'>
        <PostInfo post={post} />

        {post.userId === userId && (
          <PostSettingsDropdown
            isLoggedIn={isLoggedIn}
            userId={userId}
            post={post}
            showRawContent={true}
            onDeleteSuccess={() => router.push('/')}
          >
            <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2 cursor-pointer' />
          </PostSettingsDropdown>
        )}
      </div>
    </div>
  );
}
