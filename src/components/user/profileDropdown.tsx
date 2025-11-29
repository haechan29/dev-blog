'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createRipple } from '@/lib/dom';
import { LogIn, LogOut, UserX } from 'lucide-react';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode, useCallback } from 'react';

export default function ProfileDropdown({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  const router = useRouter();

  const handleAction = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      const actionAttribute = e.currentTarget.getAttribute('data-action');
      switch (actionAttribute) {
        case 'login': {
          await signIn();
          router.refresh();
          break;
        }
        case 'logout': {
          await signOut();
          router.refresh();
          break;
        }
        case 'delete-account': {
          // 모달 열기
          break;
        }
      }
    },
    [router]
  );

  return (
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
        {session?.user ? (
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
  );
}
