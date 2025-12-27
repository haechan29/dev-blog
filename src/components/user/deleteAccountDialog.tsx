'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApiError } from '@/errors/errors';
import useUser from '@/features/user/domain/hooks/useUser';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DeleteAccountDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouterWithProgress();
  const { deleteUserMutation } = useUser();

  useEffect(() => {
    if (!isOpen) {
      deleteUserMutation.reset();
    }
  }, [deleteUserMutation, isOpen]);

  const handleDelete = useCallback(async () => {
    deleteUserMutation.mutate(undefined, {
      onSuccess: async () => {
        await signOut();
        router.refresh();
        setIsOpen(false);
      },
      onError: error => {
        const message =
          error instanceof ApiError
            ? error.message
            : '회원 탈퇴에 실패했습니다';
        toast.error(message);
      },
    });
  }, [deleteUserMutation, router, setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>회원 탈퇴 다이어로그</DialogTitle>
        <DialogDescription className='sr-only'>
          회원 탈퇴를 진행합니다.
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>회원 탈퇴</div>
        <div className='text-sm text-gray-500 mb-4'>
          정말로 계정을 삭제할까요?
        </div>
        <div className='text-xs text-gray-500 bg-gray-50 p-3 rounded mb-8'>
          <div className='font-semibold mb-1'>삭제되는 계정 정보</div>
          <ul className='list-disc list-inside space-y-0.5'>
            <li>닉네임</li>
            <li>이메일 주소</li>
          </ul>
        </div>

        <div className='flex justify-between items-center'>
          <button
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-red-400',
              deleteUserMutation.isPending ? 'bg-red-400' : 'bg-red-600'
            )}
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              '탈퇴하기'
            )}
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
