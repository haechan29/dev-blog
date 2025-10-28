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
          className='flex items-center gap-2 text-gray-400 hover:text-blue-600 cursor-pointer'
        >
          <Edit2 size={16} />
          수정
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className='flex items-center gap-2 text-gray-400 hover:text-red-600 cursor-pointer'
        >
          <Trash2 size={16} />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
