'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import useSeries from '@/features/series/domain/hooks/useSeries';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { useCallback } from 'react';

export default function DeleteSeriesDialog({
  userId,
  seriesId,
  isOpen,
  setIsOpen,
}: {
  userId: string;
  seriesId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { deleteSeriesMutation } = useSeries(userId);

  const deleteSeries = useCallback(
    (seriesId: string) => {
      deleteSeriesMutation.mutate(seriesId, {
        onSuccess: () => {
          setIsOpen(false);
        },
      });
    },
    [deleteSeriesMutation, setIsOpen]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>시리즈 삭제 다이얼로그</DialogTitle>
        <DialogDescription className='sr-only'>
          이 시리즈를 삭제할까요?
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>시리즈 삭제</div>
        <div className='text-sm text-gray-500 mb-6'>
          이 시리즈를 삭제할까요?
        </div>

        <div className='flex justify-between items-center'>
          <button
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-red-400',
              deleteSeriesMutation.isPending ? 'bg-red-400' : 'bg-red-600'
            )}
            onClick={() => deleteSeries(seriesId)}
          >
            {deleteSeriesMutation.isPending ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              '삭제'
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
