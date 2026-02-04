'use client';

import ProfileIcon from '@/components/user/profileIcon';
import { SubscriptionDto } from '@/features/subscription/data/dto/subscriptionDto';
import { UserStatus } from '@/features/user/domain/model/user';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function UserProfile({
  userId,
  userName,
  userStatus,
  userBio,
  initialData,
  currentUserId,
  className,
}: {
  userId: string;
  userName: string;
  userStatus: UserStatus;
  userBio?: string;
  initialData?: SubscriptionDto;
  currentUserId?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center max-sm:justify-between max-sm:gap-4 sm:gap-12',
        className
      )}
    >
      <div className='flex items-center gap-4 flex-1 min-w-0'>
        <ProfileIcon
          nickname={userName}
          isActive={userStatus === 'ACTIVE'}
          size='lg'
        />
        <div className='flex-1 min-w-0'>
          <Link
            href={`/@${userId}/posts`}
            className='block text-xl font-semibold text-gray-900 hover:underline truncate'
          >
            {userName}
          </Link>

          {userBio && (
            <div className='text-sm text-gray-500 trunc'>{userBio}</div>
          )}
        </div>
      </div>
    </div>
  );
}
