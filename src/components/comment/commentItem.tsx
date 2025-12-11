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
}: {
  isLoggedIn: boolean;
  userId?: string;
  comment: CommentItemProps;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='py-4 border-b border-b-gray-200'>
      <div className='flex justify-between items-start mb-6'>
        <div className='flex items-center space-x-3'>
          <ProfileIcon
            nickname={comment.authorName}
            isActive={comment.userStatus === 'ACTIVE'}
          />

          <div>
            <Link
              href={`/@${comment.userId}/posts`}
              className='text-gray-900 hover:underline'
            >
              {comment.authorName}
            </Link>

            <p className='text-sm text-gray-500'>
              {comment.createdAt}
              {comment.isUpdated && (
                <span className='ml-1 text-gray-400'>(수정됨)</span>
              )}
            </p>
          </div>
        </div>

        {comment.userId === userId && (
          <CommentSettingsDropdown
            isLoggedIn={isLoggedIn}
            comment={comment}
            onEdit={() => setIsEditing(prev => !prev)}
          >
            <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2' />
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
  );
}
