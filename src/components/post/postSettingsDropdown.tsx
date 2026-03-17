'use client';

import DeletePostDialog from '@/components/post/deletePostDialog';
import SeriesSettingsDialog from '@/components/series/seriesSettingsDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PostProps } from '@/features/post/ui/postProps';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { createRipple } from '@/lib/dom';
import { Edit2, Layers, Trash2 } from 'lucide-react';
import { MouseEvent, ReactNode, useCallback, useState } from 'react';

export default function PostSettingsDropdown({
  skipPasswordInput = false,
  userId,
  post,
  onDeleteSuccess,
  children,
}: {
  skipPasswordInput?: boolean;
  userId?: string;
  post: PostProps;
  onDeleteSuccess?: () => void;
  children: ReactNode;
}) {
  const router = useRouterWithProgress();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSeriesDialogOpen, setIsSeriesDialogOpen] = useState(false);

  const handleAction = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const actionAttribute = e.currentTarget.getAttribute('data-action');
      switch (actionAttribute) {
        case 'series-settings': {
          if (!isSeriesDialogOpen) setIsSeriesDialogOpen(true);
          break;
        }
        case 'edit': {
          router.push(`/read/${post.id}/edit`);
          break;
        }
        case 'delete': {
          if (!isDeleteDialogOpen) setIsDeleteDialogOpen(true);
          break;
        }
      }
    },
    [isDeleteDialogOpen, isSeriesDialogOpen, post.id, router]
  );

  return (
    <>
      <DeletePostDialog
        skipPasswordInput={skipPasswordInput}
        postId={post.id}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onDeleteSuccess={onDeleteSuccess}
      />

      {userId && (
        <SeriesSettingsDialog
          userId={userId}
          post={post}
          isOpen={isSeriesDialogOpen}
          setIsOpen={setIsSeriesDialogOpen}
        />
      )}

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
          <>
            <DropdownMenuItem
              data-action='series-settings'
              onClick={handleAction}
              className='w-full flex items-center gap-2 cursor-pointer'
            >
              <Layers className='w-4 h-4 text-gray-500' />
              <div className='whitespace-nowrap text-gray-900'>시리즈 설정</div>
            </DropdownMenuItem>

            <DropdownMenuItem
              data-action='edit'
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
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
