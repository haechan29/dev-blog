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
import useMediaQuery, { TOUCH_QUERY } from '@/hooks/useMediaQuery';
import clsx from 'clsx';
import { Loader2, Trash2, X } from 'lucide-react';
import { ReactNode, useCallback } from 'react';

function DeleteInquiryMessageDialog({
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
  const handleDelete = useCallback(
    (threadId: string) => {
      if (!threadId || isDeleting) return;
      onConfirm(threadId);
    },
    [isDeleting, onConfirm]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (isDeleting) return;
        onOpenChange(open);
      }}
    >
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>메시지 삭제 다이어로그</DialogTitle>
        <DialogDescription className='sr-only'>
          이 메시지를 삭제할까요?
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>메시지 삭제</div>
        <div className='text-sm text-gray-500 mb-6'>
          이 메시지를 삭제할까요?
        </div>
        <div className='flex justify-between items-center'>
          <button
            type='button'
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-red-400',
              isDeleting ? 'bg-red-400' : 'bg-red-600'
            )}
            onClick={() => handleDelete(threadId)}
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

export default function InquiryMessageDropdown({
  threadId,
  skipRender = false,
  open,
  deleteDialogOpen,
  isDeleting = false,
  setOpen,
  setDeleteDialogOpen,
  onDeleteConfirmed,
  children,
}: {
  threadId?: string;
  skipRender?: boolean;
  open: boolean;
  deleteDialogOpen: boolean;
  isDeleting?: boolean;
  setOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  onDeleteConfirmed: (threadId: string) => void;
  children: ReactNode;
}) {
  const canDelete = !!threadId;

  const isTouchDevice = useMediaQuery(TOUCH_QUERY);

  const side = isTouchDevice ? 'top' : 'bottom';

  if (skipRender) return children;

  if (!canDelete) return children;

  return (
    <>
      {canDelete && (
        <DeleteInquiryMessageDialog
          threadId={threadId}
          isOpen={deleteDialogOpen}
          isDeleting={isDeleting}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={onDeleteConfirmed}
        />
      )}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent side={side} align='end'>
          {canDelete && (
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
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
