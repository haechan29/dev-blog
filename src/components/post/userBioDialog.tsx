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
import SimpleBar from 'simplebar-react';

export default function UserBioDialog({
  userName,
  userBio,
  isOpen,
  setIsOpen,
  mode = 'view',
  onSave,
  isLoading = false,
}: {
  userName: string;
  userBio: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode?: 'view' | 'edit';
  onSave?: (bio: string) => void;
  isLoading?: boolean;
}) {
  const [bio, setBio] = useState('');

  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (isOpen) {
      setBio(userBio);
    }
  }, [isOpen, userBio]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>{userName}의 소개</DialogTitle>
        <DialogDescription className='sr-only'>
          {mode === 'view'
            ? `${userName}의 소개글입니다`
            : `소개글을 작성합니다.`}
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-4 truncate'>{userName}</div>

        {isEditMode ? (
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            className='w-full h-40 p-4 mb-6 text-sm leading-relaxed bg-gray-50 border rounded-sm resize-none outline-none focus:border-blue-500'
            placeholder='소개글을 작성해주세요'
          />
        ) : (
          <div className='max-h-64 bg-gray-50 rounded-sm mb-6 border overflow-hidden mt-3'>
            <SimpleBar className='h-full px-4 pt-4 simplebar-hover'>
              <>
                <div className='text-sm text-gray-900 leading-relaxed break-keep whitespace-pre-wrap'>
                  {userBio}
                </div>
                <div className='w-1 h-4' aria-hidden={true} />
              </>
            </SimpleBar>
          </div>
        )}

        <div className='flex justify-between items-center'>
          {isEditMode ? (
            <button
              className={clsx(
                'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white',
                isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'
              )}
              onClick={() => onSave?.(bio)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={18} strokeWidth={3} className='animate-spin' />
              ) : (
                <div className='shrink-0'>확인</div>
              )}
            </button>
          ) : (
            <div />
          )}
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
