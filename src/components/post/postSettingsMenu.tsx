'use client';

import PostSettingsDropdown from '@/components/post/postSettingsDropdown';
import { PostProps } from '@/features/post/ui/postProps';
import { MoreVertical } from 'lucide-react';

export default function PostSettingsMenu({
  userId,
  post,
}: {
  userId: string;
  post: PostProps;
}) {
  return (
    <div
      className='shrink-0'
      onClickCapture={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <PostSettingsDropdown userId={userId} post={post} showRawContent={false}>
        <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 hover:bg-gray-200 rounded-full p-2 -m-2 cursor-pointer' />
      </PostSettingsDropdown>
    </div>
  );
}
