'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CommentPasswordDialog({
  isOpen,
  setIsOpen,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (password: string) => void;
  isLoading?: boolean;
}) {
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleClickConfirm = () => {
    if (!password.trim()) {
      setIsPasswordValid(false);
      return;
    }
    onSubmit(password);
  };

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setIsPasswordValid(true);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>비밀번호 입력</DialogTitle>
        <DialogDescription className='sr-only'>
          댓글 작성을 위해 비밀번호를 입력해주세요.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-6'>비밀번호 입력</div>

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
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-blue-500',
              isLoading ? 'bg-blue-500' : 'bg-blue-600'
            )}
            onClick={handleClickConfirm}
          >
            {isLoading ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              <div className='shrink-0'>완료</div>
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
