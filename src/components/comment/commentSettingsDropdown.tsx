'use client';

import DeleteCommentDialog from '@/components/comment/deleteCommentDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { createRipple } from '@/lib/dom';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function CommentSettingsDropdown({
  isLoggedIn,
  comment: { postId, id: commentId },
  onEdit,
  closePanel,
  children,
}: {
  isLoggedIn: boolean;
  comment: CommentItemProps;
  onEdit: () => void;
  closePanel: () => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DeleteCommentDialog
        isLoggedIn={isLoggedIn}
        postId={postId}
        commentId={commentId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        closePanel={closePanel}
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
          asChild
        >
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
