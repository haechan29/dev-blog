'use client';

import CommentContentSection from '@/components/comment/commentContentSection';
import CommentSettingsDropdown from '@/components/comment/commentSettingsDropdown';
import ProfileIcon from '@/components/user/profileIcon';
import { CommentItemProps } from '@/features/comment/ui/props/commentItemProps';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CommentItem({
  isLoggedIn,
  userId,
  comment,
  highlightCommentId,
}: {
  isLoggedIn: boolean;
  userId?: string;
  comment: CommentItemProps;
  highlightCommentId?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const isHighlighted = comment.id === highlightCommentId;

  return (
    <div
      className={clsx(
        'px-6 md:px-12 xl:px-4 py-4 flex space-x-2',
        isHighlighted && 'bg-blue-50'
      )}
    >
      <ProfileIcon
        nickname={comment.authorName}
        size='sm'
        profileImageUrl={comment.profileImageUrl}
      />

      <div className='flex-1 min-w-0'>
        <div className='flex justify-between gap-2 items-center mb-2'>
          <div className='flex gap-2 flex-1 min-w-0 items-center'>
            <Link
              href={`/@${comment.userId}/posts`}
              className='text-gray-700 font-medium truncate hover:underline'
            >
              {comment.authorName}
            </Link>

            <div className='flex gap-1 items-center shrink-0 text-xs text-gray-500'>
              {comment.createdAt}
              {comment.isUpdated && (
                <div className='text-gray-400'>(수정됨)</div>
              )}
            </div>
          </div>

          {comment.userId === userId && (
            <CommentSettingsDropdown
              isLoggedIn={isLoggedIn}
              comment={comment}
              highlightCommentId={highlightCommentId}
              onEdit={() => setIsEditing(prev => !prev)}
            >
              <MoreVertical className='w-8 h-8 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2' />
            </CommentSettingsDropdown>
          )}
        </div>

        <CommentContentSection
          comment={comment}
          isLoggedIn={isLoggedIn}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          highlightCommentId={highlightCommentId}
        />
      </div>
    </div>
  );
}
