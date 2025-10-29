'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createRipple } from '@/lib/dom';
import { Edit2, Trash2 } from 'lucide-react';
import { TouchEvent, useCallback } from 'react';

export default function PostSettingsDropdown({
  children,
  onEdit,
  onDelete,
}: {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const onTouchStart = useCallback((e: TouchEvent<HTMLButtonElement>) => {
    const touch = e.touches[0];
    createRipple({
      clientX: touch.clientX,
      clientY: touch.clientY,
      currentTarget: e.currentTarget,
    });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onTouchStart={onTouchStart} asChild>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={onEdit}
          className='w-full flex items-center gap-2 cursor-pointer'
        >
          <Edit2 className='w-4 h-4 text-gray-500' />
          <div className='shrink-0 text-gray-900'>수정</div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className='w-full flex items-center gap-2 cursor-pointer'
        >
          <Trash2 className='w-4 h-4 text-red-400' />
          <div className='shrink-0 text-red-600'>삭제</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
