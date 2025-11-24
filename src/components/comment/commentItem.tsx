'use client';

import CommentContentSection from '@/components/comment/commentContentSection';
import CommentSettingsDropdown from '@/components/comment/commentSettingsDropdown';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function CommentItem({
  comment,
}: {
  comment: CommentItemProps;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='py-4 border-b border-b-gray-200'>
      <section className='flex justify-between items-start mb-6'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-linear-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold'>
            {comment.authorName.charAt(0)}
          </div>
          <div>
            <h4 className='font-semibold text-gray-900'>
              {comment.authorName}
            </h4>
            <p className='text-sm text-gray-500'>
              {comment.createdAt}
              {comment.isUpdated && (
                <span className='ml-1 text-gray-400'>(수정됨)</span>
              )}
            </p>
          </div>
        </div>

        <CommentSettingsDropdown
          comment={comment}
          onEdit={() => setIsEditing(prev => !prev)}
        >
          <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 rounded-full p-2 -m-2' />
        </CommentSettingsDropdown>
      </section>

      <CommentContentSection
        comment={comment}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}
