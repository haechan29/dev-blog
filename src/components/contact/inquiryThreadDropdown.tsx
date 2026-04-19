'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createRipple } from '@/lib/dom';
import clsx from 'clsx';
import { Loader2, Trash2, X } from 'lucide-react';
import { ReactNode, useCallback, useState } from 'react';

function DeleteInquiryThreadDialog({
  threadId,
  isOpen,
  isDeleting = false,
  onOpenChange,
  onConfirm,
}: {
  threadId: string;
  isOpen: boolean;
  isDeleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (threadId: string) => void;
}) {
  const handleDelete = useCallback(() => {
    if (!threadId || isDeleting) return;
    onConfirm(threadId);
  }, [threadId, isDeleting, onConfirm]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (isDeleting) return;
        onOpenChange(open);
      }}
    >
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>문의 삭제 다이어로그</DialogTitle>
        <DialogDescription className='sr-only'>
          이 문의를 삭제할까요?
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>문의 삭제</div>
        <div className='text-sm text-gray-500 mb-6'>이 문의를 삭제할까요?</div>
        <div className='flex justify-between items-center'>
          <button
            type='button'
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-red-400',
              isDeleting ? 'bg-red-400' : 'bg-red-600'
            )}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
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

export default function InquiryThreadDropdown({
  threadId,
  deleteDialogOpen,
  isDeleting = false,
  setDeleteDialogOpen,
  onDeleteConfirmed,
  children,
}: {
  threadId: string;
  deleteDialogOpen: boolean;
  isDeleting?: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  onDeleteConfirmed: (threadId: string) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DeleteInquiryThreadDialog
        threadId={threadId}
        isOpen={deleteDialogOpen}
        isDeleting={isDeleting}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onDeleteConfirmed}
      />

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          asChild
          onTouchStart={e => {
            const touch = e.touches[0];
            createRipple({
              clientX: touch.clientX,
              clientY: touch.clientY,
              currentTarget: e.currentTarget,
            });
          }}
        >
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            variant='destructive'
            className='cursor-pointer'
            onSelect={() => {
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className='size-4' />
            <span>삭제</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
