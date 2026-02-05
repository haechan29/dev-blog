'use client';

import UserBioDialog from '@/components/post/userBioDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProfileIcon from '@/components/user/profileIcon';
import { ApiError } from '@/errors/errors';
import { SubscriptionDto } from '@/features/subscription/data/dto/subscriptionDto';
import { useProfile } from '@/features/user/domain/hooks/useProfile';
import { UserProps } from '@/features/user/ui/userProps';
import { cn } from '@/lib/utils';
import { Edit2, ImageIcon, MoreVertical } from 'lucide-react';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function UserProfile({
  initialUser,
  initialData,
  currentUserId,
  className,
}: {
  initialUser: UserProps;
  initialData?: SubscriptionDto;
  currentUserId?: string;
  className?: string;
}) {
  const bioRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');

  const { user, updateBioMutation, updateImageMutation } =
    useProfile(initialUser);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateImageMutation.mutate(file, {
        onError: error => {
          const message =
            error instanceof ApiError
              ? error.message
              : '이미지 업로드에 실패했습니다';
          toast.error(message);
        },
      });
      e.target.value = '';
    }
  };

  const updateBio = (bio: string) => {
    updateBioMutation.mutate(bio, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
      onError: error => {
        const message =
          error instanceof ApiError
            ? error.message
            : '프로필 수정에 실패했습니다';
        toast.error(message);
      },
    });
  };

  useLayoutEffect(() => {
    if (bioRef.current) {
      setHasOverflow(bioRef.current.scrollWidth > bioRef.current.clientWidth);
    }
  }, [user?.bio]);

  if (!user) {
    return null;
  }

  return (
    <>
      <div className={cn('flex items-center gap-4', className)}>
        <ProfileIcon
          nickname={user.nickname}
          size='lg'
          profileImageUrl={user.profileImageUrl}
          isLoading={updateImageMutation.isPending}
        />
        <div className='flex-1 min-w-0'>
          <div className='flex justify-between items-start gap-4'>
            <div className='xl:max-w-[40%] text-xl font-semibold text-gray-900 truncate'>
              {user.nickname}
            </div>
            {user.id === currentUserId && (
              <UserSettingsDropdown
                onEditBio={() => {
                  setDialogMode('edit');
                  setIsDialogOpen(true);
                }}
                onEditImage={() => fileInputRef.current?.click()}
              >
                <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2 cursor-pointer shrink-0' />
              </UserSettingsDropdown>
            )}
          </div>

          {user.bio && (
            <div className='xl:max-w-[60%] flex items-center gap-1 text-sm'>
              <div ref={bioRef} className='text-gray-500 truncate'>
                {user.bio}
              </div>
              {hasOverflow && (
                <button
                  onClick={() => {
                    setDialogMode('view');
                    setIsDialogOpen(true);
                  }}
                  className='shrink-0 text-gray-500 hover:text-gray-400 cursor-pointer'
                >
                  더보기
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleImageChange}
      />

      <UserBioDialog
        userName={user.nickname}
        userBio={user.bio}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        mode={dialogMode}
        onSave={bio => updateBio(bio)}
        isLoading={updateBioMutation.isPending}
      />
    </>
  );
}

function UserSettingsDropdown({
  children,
  onEditBio,
  onEditImage,
}: {
  children: ReactNode;
  onEditBio: () => void;
  onEditImage: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          className='w-full flex items-center gap-2 cursor-pointer'
          onClick={onEditImage}
        >
          <ImageIcon className='w-4 h-4 text-gray-500' />
          <div className='whitespace-nowrap text-gray-900'>프로필 설정</div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='w-full flex items-center gap-2 cursor-pointer'
          onClick={onEditBio}
        >
          <Edit2 className='w-4 h-4 text-gray-500' />
          <div className='whitespace-nowrap text-gray-900'>소개 설정</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
