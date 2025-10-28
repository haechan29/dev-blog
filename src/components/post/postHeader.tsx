'use client';

import PostInfo from '@/components/post/postInfo';
import useHeaderTracker from '@/features/post/hooks/useHeaderTracker';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import { useCallback, useRef } from 'react';

export default function PostHeader({ post }: { post: PostProps }) {
  const { title, tags } = post;
  const headerRef = useRef<HTMLDivElement | null>(null);
  useHeaderTracker(headerRef);
  const onClick = useCallback(() => console.log('click!'), []);

  return (
    <div className='flex flex-col gap-6 mb-10'>
      <div className='text-3xl font-bold line-clamp-2'>{title}</div>

      <div className='flex'>
        <div className='w-full flex overflow-x-auto scrollbar-hide'>
          <div className='flex gap-3'>
            {tags.map((tag, index) => (
              <div
                key={tag}
                className={clsx(
                  'text-center text-xs px-2 py-1 border border-gray-300 rounded-full',
                  index >= 3 && 'max-w-20 truncate'
                )}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex justify-between items-center'>
        <PostInfo {...post} />
        <button
          aria-label='게시물 설정'
          className='flex justify-center items-center p-2 -m-2'
          onClick={onClick}
        >
          <MoreVertical className='w-5 h-5 text-gray-400' />
        </button>
      </div>
    </div>
  );
}
