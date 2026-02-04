'use client';

import UserBioDialog from '@/components/post/userBioDialog';
import ProfileIcon from '@/components/user/profileIcon';
import { SubscriptionDto } from '@/features/subscription/data/dto/subscriptionDto';
import { UserStatus } from '@/features/user/domain/model/user';
import { cn } from '@/lib/utils';
import { useLayoutEffect, useRef, useState } from 'react';

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
  const bioRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useLayoutEffect(() => {
    if (bioRef.current) {
      setHasOverflow(bioRef.current.scrollWidth > bioRef.current.clientWidth);
    }
  }, [userBio]);

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
          <div className='xl:max-w-[40%] text-xl font-semibold text-gray-900'>
            {userName}
          </div>

          {userBio && (
            <div className='xl:max-w-[60%] flex items-center gap-1 text-sm'>
              <div ref={bioRef} className='text-gray-500 truncate'>
                {userBio}
              </div>
              {hasOverflow && (
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className='shrink-0 text-gray-500 hover:text-gray-400 cursor-pointer'
                >
                  더보기
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <UserBioDialog
        userName={userName}
        userBio={userBio ?? ''}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
    </div>
  );
}
