'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import useSeries from '@/features/series/domain/hooks/useSeries';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { useCallback } from 'react';

export default function RemovePostDialog({
  series,
  postId,
  resetPostId,
}: {
  series: SeriesProps;
  postId: string | null;
  resetPostId: () => void;
}) {
  const { removePostMutation } = useSeries(series);

  const handleRemove = useCallback(async () => {
    if (!postId) return;
    removePostMutation.mutate(postId, {
      onSuccess: () => {
        resetPostId();
      },
    });
  }, [postId, removePostMutation, resetPostId]);

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
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-red-400',
              removePostMutation.isPending ? 'bg-red-400' : 'bg-red-600'
            )}
            onClick={handleRemove}
            disabled={removePostMutation.isPending}
          >
            {removePostMutation.isPending ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              '제거'
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
