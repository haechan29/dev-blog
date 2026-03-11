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

export function DeleteDraftDialog({
  draftId,
  isOpen,
  setIsOpen,
  isPending,
  onDelete,
}: {
  draftId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isPending: boolean;
  onDelete: (draftId: string) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>임시저장 글 삭제</DialogTitle>
        <DialogDescription className='sr-only'>
          선택한 임시저장 글을 삭제합니다.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-1'>임시저장 글 삭제</div>
        <div className='text-sm text-gray-500 mb-8'>
          선택한 임시저장 글을 삭제합니다.
        </div>

        <div className='flex justify-between items-center'>
          <button
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white',
              isPending ? 'bg-red-400' : 'bg-red-600 hover:bg-red-400'
            )}
            onClick={() => onDelete(draftId)}
            disabled={isPending}
          >
            {isPending ? (
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
