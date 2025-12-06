'use client';

import DeleteSeriesDialog from '@/components/series/deleteSeriesDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import { createRipple } from '@/lib/dom';
import { Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode, useCallback, useState } from 'react';

export default function SeriesSettingsDropdown({
  userId,
  series,
  children,
}: {
  userId: string;
  series: SeriesProps;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAction = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const actionAttribute = e.currentTarget.getAttribute('data-action');
      switch (actionAttribute) {
        case 'update': {
          router.push(`/@${userId}/series/${series.id}/edit`);
          break;
        }
        case 'delete': {
          if (!isDeleteDialogOpen) setIsDeleteDialogOpen(true);
          break;
        }
      }
    },
    [isDeleteDialogOpen, router, series.id, userId]
  );

  return (
    <>
      <DeleteSeriesDialog
        userId={userId}
        seriesId={series.id}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger
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
            data-action='update'
            onClick={handleAction}
            className='w-full flex items-center gap-2 cursor-pointer'
          >
            <Edit2 className='w-4 h-4 text-gray-500' />
            <div className='whitespace-nowrap text-gray-900'>수정</div>
          </DropdownMenuItem>

          <DropdownMenuItem
            data-action='delete'
            onClick={handleAction}
            className='w-full flex items-center gap-2 cursor-pointer'
          >
            <Trash2 className='w-4 h-4 text-red-400' />
            <div className='whitespace-nowrap text-red-600'>삭제</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
