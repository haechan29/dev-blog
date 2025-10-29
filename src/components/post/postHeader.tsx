'use client';

import PostInfo from '@/components/post/postInfo';
import PostSettingsDropdown from '@/components/post/postSettingsDropdown';
import useHeaderTracker from '@/features/post/hooks/useHeaderTracker';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import { useRef } from 'react';

export default function PostHeader({ post }: { post: PostProps }) {
  const { title, tags } = post;
  const headerRef = useRef<HTMLDivElement | null>(null);
  useHeaderTracker(headerRef);

  return (
    <div className='flex flex-col gap-6 mb-10'>
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
        <PostInfo {...post} />
        <PostSettingsDropdown post={post} onEdit={() => console.log('edit')}>
          <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2' />
        </PostSettingsDropdown>
      </div>
    </div>
  );
}
