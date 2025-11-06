'use client';

import DeletePostDialog from '@/components/post/deletePostDialog';
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
import { setMode } from '@/lib/redux/postReaderSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { Code2, Edit2, FileText, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostSettingsDropdown({
  children,
  post: { id: postId },
}: {
  children: React.ReactNode;
  post: PostProps;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const debounce = useDebounce();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const postReader = useSelector((state: RootState) => state.postReader);
  const [debouncedMode, setDebouncedMode] =
    useState<PostReader['mode']>('parsed');

  const handleAction = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const actionAttribute = e.currentTarget.getAttribute('data-action');
      switch (actionAttribute) {
        case 'toggle-mode': {
          const mode = postReader.mode === 'parsed' ? 'raw' : 'parsed';
          dispatch(setMode(mode));
          break;
        }
        case 'edit': {
          router.push(`/posts/${postId}/edit?step=write`);
          break;
        }
        case 'delete': {
          if (!isOpen) setIsOpen(true);
          break;
        }
      }
    },
    [dispatch, isOpen, postId, postReader.mode, router]
  );

  useEffect(() => {
    debounce(() => {
      setDebouncedMode(postReader.mode);
    }, 300);
  }, [postReader.mode, debounce]);

  return (
    <>
      <DeletePostDialog postId={postId} isOpen={isOpen} setIsOpen={setIsOpen} />
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
          asChild
        >
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            data-action='toggle-mode'
            onClick={handleAction}
            className='w-full flex items-center gap-2 cursor-pointer'
          >
            {debouncedMode === 'parsed' ? (
              <>
                <Code2 className='w-4 h-4 text-gray-500' />
                <div className='whitespace-nowrap text-gray-900'>원문 보기</div>
              </>
            ) : (
              <>
                <FileText className='w-4 h-4 text-gray-500' />
                <div className='whitespace-nowrap text-gray-900'>일반 보기</div>
              </>
            )}
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
