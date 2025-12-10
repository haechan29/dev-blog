'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteAccountDialog from '@/components/user/deleteAccountDialog';
import { createRipple } from '@/lib/dom';
import { LogIn, LogOut, UserX } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode, useCallback, useState } from 'react';

export default function ProfileDropdown({
  isLoggedIn,
  children,
}: {
  isLoggedIn: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

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
          asChild
        >
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          {isLoggedIn ? (
            <>
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
            <DropdownMenuItem
              data-action='login'
              onClick={handleAction}
              className='w-full flex items-center gap-2 cursor-pointer'
            >
              <LogIn className='w-4 h-4 text-gray-500' />
              <div className='whitespace-nowrap text-gray-900'>로그인</div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
