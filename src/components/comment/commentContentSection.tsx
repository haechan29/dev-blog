'use client';

import CommentLikeButton from '@/components/comment/commentLikeButton';
import { updateComment } from '@/features/comment/domain/service/commentClientService';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { ApiError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function CommentContentSection({
  comment,
  isLoggedIn,
  isEditing,
  setIsEditing,
}: {
  comment: CommentItemProps;
  isLoggedIn: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState('');
  const [content, setContent] = useState(comment.content);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isContentValid, setIsContentValid] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setPassword('');
      setContent(comment.content);
      setIsPasswordValid(true);
      setIsContentValid(true);
    }
  }, [isEditing, comment.content]);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflow(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [comment.content]);

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
    onError: error => {
      const message =
        error instanceof ApiError ? error.message : '댓글 수정에 실패했습니다';
      toast.error(message);
    },
  });

  const handleEdit = () => {
    if (!isLoggedIn && !password.trim()) {
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

  return isEditing ? (
    <div className='space-y-3'>
      {!isLoggedIn && (
        <input
          type='password'
          value={password}
          onChange={e => {
            setIsPasswordValid(true);
            setPassword(e.target.value);
          }}
          placeholder='비밀번호'
          className={clsx(
            'w-full p-2 outline-none border rounded-lg',
            isPasswordValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            password ? 'bg-white' : 'bg-gray-50'
          )}
        />
      )}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder='댓글을 작성해주세요'
        className={clsx(
          'w-full p-3 resize-none outline-none border rounded-lg overflow-y-hidden',
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
          className={clsx(
            'h-9 flex justify-center items-center px-4 text-white rounded-lg hover:bg-blue-500',
            editComment.isPending ? 'bg-blue-500' : 'bg-blue-600'
          )}
        >
          {editComment.isPending ? (
            <Loader2 size={18} strokeWidth={2} className='animate-spin' />
          ) : (
            '댓글 수정'
          )}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className='w-14 h-9 flex justify-center items-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
        >
          취소
        </button>
      </div>
    </div>
  ) : (
    <>
      <div className='relative'>
        <div
          ref={contentRef}
          className={clsx(
            'text-gray-800 mb-3',
            !isExpanded && 'max-h-18 overflow-hidden'
          )}
        >
          {comment.content}
        </div>

        {!isExpanded && isOverflow && (
          <div className='h-6 absolute bottom-0 right-0 pl-8 bg-linear-to-l from-white from-60% to-transparent'>
            <button
              onClick={() => setIsExpanded(true)}
              className='cursor-pointer text-sm text-gray-400 hover:text-gray-500'
            >
              더보기
            </button>
          </div>
        )}
      </div>

      <CommentLikeButton comment={comment} />
    </>
  );
}
