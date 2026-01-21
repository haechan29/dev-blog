'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit2, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

export function CreatorSettingsDropdown({
  onEdit,
  onDelete,
  children,
}: {
  onEdit: () => void;
  onDelete: () => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          className='flex items-center gap-2 cursor-pointer'
        >
          <Edit2 className='w-4 h-4 text-gray-500' />
          <span>수정</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          className='flex items-center gap-2 cursor-pointer'
        >
          <Trash2 className='w-4 h-4 text-red-400' />
          <span className='text-red-600'>삭제</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
