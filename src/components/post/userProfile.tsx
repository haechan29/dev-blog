'use client';

import SubscribeButton from '@/components/post/subscribeButton';
import ProfileIcon from '@/components/user/profileIcon';
import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';
import { UserStatus } from '@/features/user/domain/model/user';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function UserProfile({
  userId,
  userName,
  userStatus,
  currentUserId,
}: {
  userId: string;
  userName: string;
  userStatus: UserStatus;
  currentUserId?: string;
}) {
  const { data } = useQuery({
    queryKey: ['subscription', userId],
    queryFn: () => SubscriptionClientRepository.getSubscriptionInfo(userId),
    enabled: currentUserId !== userId,
  });

  return (
    <div className='flex items-center max-sm:justify-between sm:gap-12 mb-12'>
      <div className='flex items-center gap-3'>
        <ProfileIcon nickname={userName} isActive={userStatus === 'ACTIVE'} />
        <div>
          <Link
            href={`/@${userId}/posts`}
            className='font-medium text-gray-900 hover:underline'
          >
            {userName}
          </Link>

          <div className='text-xs text-gray-500'>
            {`구독자 ${data?.subscriberCount ?? 0}명`}
          </div>
        </div>
      </div>

      {userId !== currentUserId && (
        <SubscribeButton
          userId={userId}
          isSubscribed={data?.isSubscribed ?? false}
        />
      )}
    </div>
  );
}
