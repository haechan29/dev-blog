'use client';

import InquiryDialog from '@/components/inquiry/inquiryDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteAccountDialog from '@/components/user/deleteAccountDialog';
import ProfileIcon from '@/components/user/profileIcon';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { createRipple } from '@/lib/dom';
import { LogIn, LogOut, MessageSquare, UserX } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import { MouseEvent, ReactNode, useCallback, useState } from 'react';

export default function ProfileDropdown({
  isLoggedIn,
  userId,
  nickname,
  children,
}: {
  isLoggedIn: boolean;
  userId?: string;
  nickname: string;
  children: ReactNode;
}) {
  const router = useRouterWithProgress();
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isInquiryDialogVisible, setIsInquiryDialogVisible] = useState(false);

  const handleAction = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      const actionAttribute = e.currentTarget.getAttribute('data-action');
      switch (actionAttribute) {
        case 'login': {
          await signIn();
          break;
        }
        case 'logout': {
          await signOut();
          router.refresh();
          break;
        }
        case 'delete-account': {
          setIsDeleteDialogVisible(true);
          break;
        }
        case 'inquiry': {
          setIsInquiryDialogVisible(true);
          break;
        }
      }
    },
    [router]
  );

  return (
    <>
      <DeleteAccountDialog
        isOpen={isDeleteDialogVisible}
        setIsOpen={setIsDeleteDialogVisible}
      />

      <InquiryDialog
        isOpen={isInquiryDialogVisible}
        setIsOpen={setIsInquiryDialogVisible}
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          onTouchStart={e => {
            const touch = e.touches[0];
            createRipple({
              clientX: touch.clientX,
              clientY: touch.clientY,
              currentTarget: e.currentTarget,
            });
          }}
        >
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='min-w-48'>
          <div
            className='flex items-center gap-3 p-2 cursor-pointer group'
            onClick={() => userId && router.push(`/@${userId}/posts`)}
          >
            <ProfileIcon
              nickname={nickname}
              isActive={isLoggedIn}
              hoverable={false}
            />
            <div className='flex flex-col'>
              <div className='text-sm font-medium text-gray-900'>
                {nickname}
              </div>
              <div className='text-xs text-blue-600 group-hover:underline'>
                프로필 보기
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {isLoggedIn ? (
            <>
              <DropdownMenuItem
                data-action='inquiry'
                onClick={handleAction}
                className='w-full flex items-center gap-2 cursor-pointer'
              >
                <MessageSquare className='w-4 h-4 text-gray-500' />
                <div className='whitespace-nowrap text-gray-900'>문의하기</div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                data-action='logout'
                onClick={handleAction}
                className='w-full flex items-center gap-2 cursor-pointer'
              >
                <LogOut className='w-4 h-4 text-gray-500' />
                <div className='whitespace-nowrap text-gray-900'>로그아웃</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                data-action='delete-account'
                onClick={handleAction}
                className='w-full flex items-center gap-2 cursor-pointer'
              >
                <UserX className='w-4 h-4 text-red-500' />
                <div className='whitespace-nowrap text-red-600'>회원 탈퇴</div>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                data-action='login'
                onClick={handleAction}
                className='w-full flex items-center gap-2 cursor-pointer'
              >
                <LogIn className='w-4 h-4 text-gray-500' />
                <div className='whitespace-nowrap text-gray-900'>로그인</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                data-action='inquiry'
                onClick={handleAction}
                className='w-full flex items-center gap-2 cursor-pointer'
              >
                <MessageSquare className='w-4 h-4 text-gray-500' />
                <div className='whitespace-nowrap text-gray-900'>문의하기</div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
