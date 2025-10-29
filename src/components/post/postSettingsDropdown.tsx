'use client';

import DeletePostDialog from '@/components/post/deletePostDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PostProps } from '@/features/post/ui/postProps';
import { createRipple } from '@/lib/dom';
import { Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PostSettingsDropdown({
  children,
  post: { id: postId },
}: {
  children: React.ReactNode;
  post: PostProps;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
            onClick={() => {
              router.push(`/posts/${postId}/edit?step=write`);
            }}
            className='w-full flex items-center gap-2 cursor-pointer'
          >
            <Edit2 className='w-4 h-4 text-gray-500' />
            <div className='shrink-0 text-gray-900'>수정</div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              if (!isOpen) setIsOpen(true);
            }}
            className='w-full flex items-center gap-2 cursor-pointer'
          >
            <Trash2 className='w-4 h-4 text-red-400' />
            <div className='shrink-0 text-red-600'>삭제</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
