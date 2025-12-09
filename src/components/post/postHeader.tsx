'use client';

import PostInfo from '@/components/post/postInfo';
import PostSettingsDropdown from '@/components/post/postSettingsDropdown';
import { PostProps } from '@/features/post/ui/postProps';
import { setIsHeaderVisible } from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function PostHeader({
  userId,
  post,
}: {
  userId: string | null;
  post: PostProps;
}) {
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
      <div className='text-3xl font-bold line-clamp-2'>{title}</div>

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

        {((!post.userId && !userId) || post.userId === userId) && (
          <PostSettingsDropdown
            userId={userId}
            post={post}
            showRawContent={true}
          >
            <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2 cursor-pointer' />
          </PostSettingsDropdown>
        )}
      </div>
    </div>
  );
}
