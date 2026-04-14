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
import { Trash2, X } from 'lucide-react';
import { ReactNode, useState } from 'react';

function DeleteInquiryMessageDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>메시지 삭제 다이어로그</DialogTitle>
        <DialogDescription className='sr-only'>
          이 메시지를 삭제할까요?
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>메시지 삭제</div>
        <div className='text-sm text-gray-500 mb-6'>이 메시지를 삭제할까요?</div>
        <div className='flex justify-between items-center'>
          <button
            type='button'
            className='flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white bg-red-600 hover:bg-red-400'
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
          >
            <div className='shrink-0'>삭제</div>
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
  skipRender = false,
  open,
  setOpen,
  children,
  onDeleteConfirmed,
}: {
  skipRender?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  onDeleteConfirmed?: () => void;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isTouchDevice = useMediaQuery(TOUCH_QUERY);

  const side = isTouchDevice ? 'top' : 'bottom';

  if (skipRender) return children;

  return (
    <>
      <DeleteInquiryMessageDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onDeleteConfirmed}
      />

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent side={side} align='end'>
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
