'use client';

import SubscribeButton from '@/components/post/subscribeButton';
import ProfileIcon from '@/components/user/profileIcon';
import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';
import { UserStatus } from '@/features/user/domain/model/user';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';

export default function UserProfile({
  userId,
  userName,
  userStatus,
  currentUserId,
  size = 'sm',
  className,
}: {
  userId: string;
  userName: string;
  userStatus: UserStatus;
  currentUserId?: string;
  size?: 'sm' | 'lg';
  className?: string;
}) {
  const { data } = useQuery({
    queryKey: ['subscription', userId],
    queryFn: () => SubscriptionClientRepository.getSubscriptionInfo(userId),
    enabled: currentUserId !== userId,
  });

  return (
    <div
      className={cn(
        'flex items-center max-sm:justify-between sm:gap-12',
        className
      )}
    >
      <div
        className={clsx('flex items-center', size === 'lg' ? 'gap-4' : 'gap-3')}
      >
        <ProfileIcon
          nickname={userName}
          isActive={userStatus === 'ACTIVE'}
          size={size}
        />
        <div>
          <Link
            href={`/@${userId}/posts`}
            className={clsx(
              'font-medium text-gray-900 hover:underline',
              size === 'lg' && 'text-xl font-semibold'
            )}
          >
            {userName}
          </Link>

          <div
            className={clsx(
              'text-gray-500',
              size === 'lg' ? 'text-sm' : 'text-xs'
            )}
          >
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
