'use client';

import CommentContentSection from '@/components/comment/commentContentSection';
import CommentProfileIcon from '@/components/comment/commentProfileIcon';
import CommentSettingsDropdown from '@/components/comment/commentSettingsDropdown';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function CommentItem({
  userId,
  comment,
}: {
  userId: string | null;
  comment: CommentItemProps;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='py-4 border-b border-b-gray-200'>
      <div className='flex justify-between items-start mb-6'>
        <div className='flex items-center space-x-3'>
          <CommentProfileIcon
            isGuest={comment.isGuest}
            authorId={comment.userId}
            authorName={comment.authorName}
          />
          <div>
            <div className='font-semibold text-gray-900'>
              {comment.authorName}
            </div>
            <p className='text-sm text-gray-500'>
              {comment.createdAt}
              {comment.isUpdated && (
                <span className='ml-1 text-gray-400'>(수정됨)</span>
              )}
            </p>
          </div>
        </div>

        {((!comment.userId && !userId) || comment.userId === userId) && (
          <CommentSettingsDropdown
            userId={userId}
            comment={comment}
            onEdit={() => setIsEditing(prev => !prev)}
          >
            <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2' />
          </CommentSettingsDropdown>
        )}
      </div>

      <CommentContentSection
        comment={comment}
        userId={userId}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}
