'use client';

import CommentContentSection from '@/components/comment/commentContentSection';
import DeleteCommentDialog from '@/components/comment/deleteCommentDialog';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function CommentItem({
  comment,
}: {
  comment: CommentItemProps;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='py-4 border-b-1 border-b-gray-200'>
      <section className='flex justify-between items-start mb-6'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold'>
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

        <div className='flex space-x-2'>
          <button
            onClick={() => setIsEditing(prev => !prev)}
            className='text-gray-400 hover:text-blue-600 transition-colors p-1'
          >
            <Edit2 size={16} />
          </button>
          <DeleteCommentDialog postId={comment.postId} commentId={comment.id}>
            <button className='text-gray-400 hover:text-red-600 transition-colors p-1'>
              <Trash2 size={16} />
            </button>
          </DeleteCommentDialog>
        </div>
      </section>

      <CommentContentSection
        comment={comment}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}
