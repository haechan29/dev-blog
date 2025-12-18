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
import { XIcon } from 'lucide-react';
import { ReactNode } from 'react';

export default function CommentsPanel({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  const isLargerThanXl = useMediaQuery('(min-width: 1280px)');

  if (isLargerThanXl === undefined) return null;

  return isLargerThanXl ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-[400px] gap-0 *:data-[slot=sheet-close]:hidden'
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
        {children}
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className='px-6 md:px-12 border-b border-b-gray-200'>
          <DrawerTitle className='text-left text-lg'>{title}</DrawerTitle>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
