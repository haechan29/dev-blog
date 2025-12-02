'use client';

import DeletePostDialog from '@/components/post/deletePostDialog';
import SeriesSettingsDialog from '@/components/post/seriesSettingsDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PostReader from '@/features/post/domain/model/postReader';
import { PostProps } from '@/features/post/ui/postProps';
import useDebounce from '@/hooks/useDebounce';
import { createRipple } from '@/lib/dom';
import { setMode } from '@/lib/redux/post/postReaderSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { Code2, Edit2, FileText, Layers, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostSettingsDropdown({
  userId,
  post,
  showRawContent,
  children,
}: {
  userId: string | null;
  post: PostProps;
  showRawContent: boolean;
  children: ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();
  const router = useRouter();

  const { mode } = useSelector((state: RootState) => state.postReader);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSeriesDialogOpen, setIsSeriesDialogOpen] = useState(false);
  const [debouncedMode, setDebouncedMode] =
    useState<PostReader['mode']>('parsed');

  const handleAction = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const actionAttribute = e.currentTarget.getAttribute('data-action');
      switch (actionAttribute) {
        case 'toggle-mode': {
          const toggledMode = mode === 'parsed' ? 'raw' : 'parsed';
          dispatch(setMode(toggledMode));
          break;
        }
        case 'series-settings': {
          if (!isSeriesDialogOpen) setIsSeriesDialogOpen(true);
          break;
        }
        case 'edit': {
          router.push(`/read/${post.id}/edit?step=write`);
          break;
        }
        case 'delete': {
          if (!isDeleteDialogOpen) setIsDeleteDialogOpen(true);
          break;
        }
      }
    },
    [dispatch, isDeleteDialogOpen, isSeriesDialogOpen, mode, post.id, router]
  );

  useEffect(() => {
    debounce(() => {
      setDebouncedMode(mode);
    }, 300);
  }, [mode, debounce]);

  return (
    <>
      <DeletePostDialog
        userId={userId}
        postId={post.id}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
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
          {showRawContent && (
            <DropdownMenuItem
              data-action='toggle-mode'
              onClick={handleAction}
              className='w-full flex items-center gap-2 cursor-pointer'
            >
              {debouncedMode === 'parsed' ? (
                <>
                  <Code2 className='w-4 h-4 text-gray-500' />
                  <div className='whitespace-nowrap text-gray-900'>
                    원문 보기
                  </div>
                </>
              ) : (
                <>
                  <FileText className='w-4 h-4 text-gray-500' />
                  <div className='whitespace-nowrap text-gray-900'>
                    일반 보기
                  </div>
                </>
              )}
            </DropdownMenuItem>
          )}

          {userId && (
            <DropdownMenuItem
              data-action='series-settings'
              onClick={handleAction}
              className='w-full flex items-center gap-2 cursor-pointer'
            >
              <Layers className='w-4 h-4 text-gray-500' />
              <div className='whitespace-nowrap text-gray-900'>시리즈 설정</div>
            </DropdownMenuItem>
          )}

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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
