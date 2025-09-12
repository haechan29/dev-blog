'use client';

import { Heart, Edit2, Trash2, Loader2 } from 'lucide-react';
import DeleteCommentDialog from '@/components/deleteCommentDialog';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { updateComment } from '@/features/comment/domain/service/commentService';

function ContentItem({
  comment,
  isEditing,
  setIsEditing,
}: {
  comment: CommentItemProps;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const [password, setPassword] = useState('');
  const [content, setContent] = useState(comment.content);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isContentValid, setIsContentValid] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isEditing) {
      setPassword('');
      setContent(comment.content);
      setIsPasswordValid(true);
      setIsContentValid(true);
    }
  }, [isEditing, comment.content]);

  const editComment = useMutation({
    mutationKey: ['posts', comment.postId, 'comments', comment.id],
    mutationFn: (params: {
      postId: string;
      commentId: number;
      content: string;
      password: string;
    }) => updateComment(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', comment.postId, 'comments'],
      });
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    if (!password.trim()) {
      setIsPasswordValid(false);
      setIsContentValid(true);
      return;
    }

    if (!content.trim()) {
      setIsPasswordValid(true);
      setIsContentValid(false);
      return;
    }

    editComment.mutate({
      postId: comment.postId,
      commentId: comment.id,
      content: content.trim(),
      password: password.trim(),
    });
  };

  return (
    <div className='mb-2'>
      {isEditing ? (
        <div className='space-y-3'>
          <input
            type='password'
            value={password}
            onChange={e => {
              setIsPasswordValid(true);
              setPassword(e.target.value);
            }}
            placeholder='비밀번호'
            className={clsx(
              'w-full p-3 outline-none border rounded-lg',
              isPasswordValid
                ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
                : 'border-red-400 animate-shake',
              password ? 'bg-white' : 'bg-gray-50'
            )}
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder='댓글을 작성해주세요'
            className={clsx(
              'w-full p-4 resize-none outline-none border rounded-lg overflow-y-hidden',
              isContentValid
                ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
                : 'border-red-400 animate-shake',
              content ? 'bg-white' : 'bg-gray-50'
            )}
            rows={3}
          />
          <div className='flex space-x-2 text-sm'>
            <button
              onClick={handleEdit}
              className='w-14 h-10 flex justify-center items-center bg-blue-600 text-white rounded-lg hover:bg-blue-500'
            >
              {editComment.isPending ? (
                <Loader2 size={18} strokeWidth={2} className='animate-spin' />
              ) : (
                '저장'
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className='w-14 h-10 flex justify-center items-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className='text-gray-800 leading-relaxed mb-4'>
            {comment.content}
          </div>
          <div className='flex items-center space-x-4'>
            <button className='flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors'>
              <Heart size={16} />
              <span className='text-sm'>0</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

      <ContentItem
        comment={comment}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}
