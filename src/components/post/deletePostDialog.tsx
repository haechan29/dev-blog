'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function DeletePostDialog({
  postId,
  isOpen,
  setIsOpen,
}: {
  postId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const deletePost = useCallback(
    async (postId: string, password: string) => {
      if (!password) {
        setIsPasswordValid(false);
        return;
      }

      setIsLoading(true);
      try {
        await PostClientService.deletePost(postId, password);
        setIsOpen(false);
        router.push('/');
        toast.success('게시글이 삭제되었습니다');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '게시글 삭제에 실패했습니다';
        toast.error(errorMessage);
      }
      setIsLoading(false);
    },
    [router, setIsOpen]
  );

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setIsPasswordValid(true);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>게시글 삭제 다이어로그</DialogTitle>
        <DialogDescription className='sr-only'>
          게시글을 삭제하기 위해 비밀번호를 입력해주세요.
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>게시글 삭제</div>
        <div className='text-sm text-gray-500 mb-6'>
          정말로 게시글을 삭제할까요?
        </div>
        <input
          className={clsx(
            'w-full border p-3 mb-8 rounded-sm outline-none',
            isPasswordValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            password ? 'bg-white' : 'bg-gray-50'
          )}
          type='password'
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            setIsPasswordValid(true);
          }}
          placeholder='비밀번호를 입력하세요'
        />
        <div className='flex justify-between items-center'>
          <button
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-red-400',
              isLoading ? 'bg-red-400' : 'bg-red-600'
            )}
            onClick={() => deletePost(postId, password)}
          >
            {isLoading ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              <div className='shrink-0'>삭제</div>
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
