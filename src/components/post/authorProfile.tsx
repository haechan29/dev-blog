'use client';

import SubscribeButton from '@/components/post/subscribeButton';
import ProfileIcon from '@/components/user/profileIcon';
import { PostProps } from '@/features/post/ui/postProps';
import Link from 'next/link';

export default function AuthorProfile({
  post: { id: authorId, authorName, userStatus },
  currentUserId,
}: {
  post: PostProps;
  currentUserId?: string;
}) {
  return (
    <div className='flex items-center justify-between mb-12'>
      <div className='flex items-center gap-3'>
        <ProfileIcon nickname={authorName} isActive={userStatus === 'ACTIVE'} />
        <Link
          href={`/@${authorId}/posts`}
          className='font-medium text-gray-900 hover:underline'
        >
          {authorName}
        </Link>
      </div>

      <SubscribeButton authorId={authorId} userId={currentUserId} />
    </div>
  );
}
