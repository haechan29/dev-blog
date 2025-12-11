'use client';

import SubscribeButton from '@/components/post/subscribeButton';
import ProfileIcon from '@/components/user/profileIcon';
import { PostProps } from '@/features/post/ui/postProps';
import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function AuthorProfile({
  post: { userId: authorId, authorName, userStatus },
  userId,
}: {
  post: PostProps;
  userId?: string;
}) {
  const { data } = useQuery({
    queryKey: ['subscription', authorId],
    queryFn: () => SubscriptionClientRepository.getSubscriptionInfo(authorId),
    enabled: userId !== authorId,
  });

  return (
    <div className='flex items-center max-sm:justify-between sm:gap-12 mb-12'>
      <div className='flex items-center gap-3'>
        <ProfileIcon nickname={authorName} isActive={userStatus === 'ACTIVE'} />
        <div>
          <Link
            href={`/@${authorId}/posts`}
            className='font-medium text-gray-900 hover:underline'
          >
            {authorName}
          </Link>

          {data && (
            <div className='text-xs text-gray-500'>
              {`구독자 ${data.subscriberCount}명`}
            </div>
          )}
        </div>
      </div>

      {data && (
        <SubscribeButton
          authorId={authorId}
          userId={userId}
          isSubscribed={data.isSubscribed}
        />
      )}
    </div>
  );
}
