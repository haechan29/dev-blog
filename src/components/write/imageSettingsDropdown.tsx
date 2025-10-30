'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createRipple } from '@/lib/dom';
import { Edit2, Trash2 } from 'lucide-react';

export default function ImageSettingsDropdown({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        onTouchStart={e => {
          const touch = e.touches[0];
          createRipple({
            clientX: touch.clientX,
            clientY: touch.clientY,
            currentTarget: e.currentTarget,
          });
        }}
        asChild
      >
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem className='w-full flex items-center gap-2 cursor-pointer'>
          <Edit2 className='w-4 h-4 text-gray-500' />
          <div className='shrink-0 text-gray-900'>수정</div>
        </DropdownMenuItem>

        <DropdownMenuItem className='w-full flex items-center gap-2 cursor-pointer'>
          <Trash2 className='w-4 h-4 text-red-400' />
          <div className='shrink-0 text-red-600'>삭제</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
