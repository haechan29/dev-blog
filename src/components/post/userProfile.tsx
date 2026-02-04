'use client';

import UserBioDialog from '@/components/post/userBioDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProfileIcon from '@/components/user/profileIcon';
import { SubscriptionDto } from '@/features/subscription/data/dto/subscriptionDto';
import { UserStatus } from '@/features/user/domain/model/user';
import { cn } from '@/lib/utils';
import { Edit2, ImageIcon, MoreVertical } from 'lucide-react';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

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
    <>
      <div className={cn('flex items-center gap-4', className)}>
        <ProfileIcon
          nickname={userName}
          isActive={userStatus === 'ACTIVE'}
          size='lg'
        />
        <div className='flex-1 min-w-0'>
          <div className='flex justify-between items-start gap-4'>
            <div className='xl:max-w-[40%] text-xl font-semibold text-gray-900 truncate'>
              {userName}
            </div>
            {userId === currentUserId && (
              <UserSettingsDropdown>
                <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2 cursor-pointer shrink-0' />
              </UserSettingsDropdown>
            )}
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
    </>
  );
}

function UserSettingsDropdown({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem className='w-full flex items-center gap-2 cursor-pointer'>
          <ImageIcon className='w-4 h-4 text-gray-500' />
          <div className='whitespace-nowrap text-gray-900'>프로필 변경</div>
        </DropdownMenuItem>
        <DropdownMenuItem className='w-full flex items-center gap-2 cursor-pointer'>
          <Edit2 className='w-4 h-4 text-gray-500' />
          <div className='whitespace-nowrap text-gray-900'>소개 수정</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
