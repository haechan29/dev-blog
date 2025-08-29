'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import clsx from 'clsx';
import { X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

export default function DeleteCommentDialog({
  commentId,
  children
}: { 
  commentId: number,
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setIsPasswordValid(true);
    }
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false} className='min-w-2xl gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>{'댓글 삭제 다이어로그'}</DialogTitle>
        <DialogDescription className='sr-only'>선택한 댓글을 삭제하기 위해 비밀번호를 입력해주세요.</DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>댓글 삭제</div>
        <div className='text-sm text-gray-500 mb-6'>정말로 댓글을 삭제할까요?</div>
        <input 
          className={clsx(
            'border p-3 mb-8 rounded-sm outline-none',
            isPasswordValid ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500' : 'border-red-400 animate-shake',
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
            className='flex items-center px-6 py-2 rounded-sm font-bold text-white bg-red-600 hover:bg-red-500'
            onClick={() => {
              if (!password.trim()) {
                setIsPasswordValid(false);
                return;
              }
              
              // 삭제 처리
            }}
          >
            삭제
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}