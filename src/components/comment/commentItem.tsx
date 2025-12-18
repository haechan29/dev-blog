'use client';

import CommentContentSection from '@/components/comment/commentContentSection';
import CommentSettingsDropdown from '@/components/comment/commentSettingsDropdown';
import ProfileIcon from '@/components/user/profileIcon';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CommentItem({
  isLoggedIn,
  userId,
  comment,
  closePanel,
}: {
  isLoggedIn: boolean;
  userId?: string;
  comment: CommentItemProps;
  closePanel: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='px-6 md:px-12 xl:px-4 my-4 flex space-x-2'>
      <ProfileIcon
        nickname={comment.authorName}
        isActive={comment.userStatus === 'ACTIVE'}
        size='sm'
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
              onEdit={() => setIsEditing(prev => !prev)}
              closePanel={closePanel}
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
        />
      </div>
    </div>
  );
}
