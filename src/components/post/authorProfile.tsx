'use client';

import SubscribeButton from '@/components/post/subscribeButton';
import ProfileIcon from '@/components/user/profileIcon';
import { SubscriptionDto } from '@/features/subscription/data/dto/subscriptionDto';
import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';
import { cn } from '@/lib/utils';
import { subscriptionKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function AuthorProfile({
  userId,
  userName,
  userBio,
  userProfileImageUrl,
  initialData,
  currentUserId,
  className,
}: {
  userId: string;
  userName: string;
  userBio?: string;
  userProfileImageUrl?: string;
  initialData?: SubscriptionDto;
  currentUserId?: string;
  className?: string;
}) {
  const { data } = useQuery({
    queryKey: subscriptionKeys.info(userId),
    queryFn: () => SubscriptionClientRepository.getSubscriptionInfo(userId),
    enabled: currentUserId !== userId,
    initialData,
  });

  return (
    <div
      className={cn(
        'flex items-center max-sm:justify-between max-sm:gap-3 sm:gap-12',
        className
      )}
    >
      <div className='flex items-center gap-3 flex-1 min-w-0'>
        <ProfileIcon
          nickname={userName}
          size='md'
          profileImageUrl={userProfileImageUrl}
        />
        <div className='flex-1 min-w-0'>
          <Link
            href={`/@${userId}/posts`}
            className='block font-medium text-gray-900 hover:underline truncate'
          >
            {userName}
          </Link>

          {userBio && (
            <div className='text-xs text-gray-500 truncate'>{userBio}</div>
          )}
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
