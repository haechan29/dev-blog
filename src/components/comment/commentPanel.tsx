'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useMediaQuery from '@/hooks/useMediaQuery';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { ReactNode } from 'react';

type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content>;

export default function CommentPanel({
  open,
  onOpenChange,
  title,
  onClickWrite,
  onInteractOutside,
  comments,
  commentInput,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onClickWrite: () => void;
  onInteractOutside: SheetContentProps['onInteractOutside'];
  comments: ReactNode;
  commentInput: ReactNode;
}) {
  const isLargerThanXl = useMediaQuery('(min-width: 1280px)');

  if (isLargerThanXl === undefined) return null;

  return isLargerThanXl ? (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        side='right'
        onInteractOutside={onInteractOutside}
        className='w-80 gap-0 *:data-[slot=sheet-close]:hidden'
      >
        <SheetHeader className='px-4 border-b border-b-gray-200 flex-row items-center justify-between'>
          <SheetTitle>{title}</SheetTitle>
          <SheetClose asChild>
            <button className='p-2 -m-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer'>
              <XIcon className='size-4' />
              <div className='sr-only'>닫기</div>
            </button>
          </SheetClose>
        </SheetHeader>

        {comments}
        {commentInput}
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
      repositionInputs={false}
    >
      <DrawerContent>
        <DrawerHeader className='px-6 md:px-12 border-b border-b-gray-200 flex-row items-center justify-between'>
          <DrawerTitle className='text-left text-lg'>{title}</DrawerTitle>

          <div className='relative'>
            <button className='text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-full'>
              댓글 달기
            </button>
            <input
              onFocus={onClickWrite}
              className='absolute inset-0 opacity-0 cursor-pointer'
            />
          </div>
        </DrawerHeader>

        {comments}
        {commentInput}
      </DrawerContent>
    </Drawer>
  );
}
