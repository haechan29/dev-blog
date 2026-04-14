'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createRipple } from '@/lib/dom';
import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

export default function InquiryThreadDropdown({
  threadId,
  children,
}: {
  threadId: string;
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
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
            void threadId;
          }}
        >
          <Trash2 className='size-4' />
          <span>삭제</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
