'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useCallback } from 'react';

export default function RemovePostDialog({
  seriesId,
  postId,
  resetPostId,
}: {
  seriesId: string;
  postId: string | null;
  resetPostId: () => void;
}) {
  const handleRemove = useCallback(() => {
    if (!postId) return;

    // TODO: API 호출 로직
    setTimeout(() => {
      resetPostId();
    }, 300);
    console.log('Remove post:', seriesId, postId);
  }, [postId, resetPostId, seriesId]);

  return (
    <Dialog
      open={postId !== null}
      onOpenChange={open => !open && resetPostId()}
    >
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>글 제거</DialogTitle>
        <DialogDescription className='sr-only'>
          시리즈에서 이 글을 제거할까요?
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>글 제거</div>
        <div className='text-sm text-gray-500 mb-6'>
          시리즈에서 이 글을 제거할까요?
        </div>

        <div className='flex justify-between items-center'>
          <button
            className='flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white bg-red-600 hover:bg-red-400'
            onClick={handleRemove}
          >
            제거
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
