'use client';

import useComments from '@/features/comment/hooks/useComments';
import { ApiError } from '@/lib/api';
import clsx from 'clsx';
import { Loader2, Send } from 'lucide-react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export default function CommentForm({
  isLoggedIn,
  postId,
}: {
  isLoggedIn: boolean;
  postId: string;
}) {
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isContentValid, setIsContentValid] = useState(true);

  const { createCommentMutation } = useComments({ postId });
  const createComment = useCallback(
    (params: { postId: string; content: string; password: string }) => {
      createCommentMutation.mutate(params, {
        onSuccess: () => {
          setContent('');
          setPassword('');
        },
        onError: error => {
          const message =
            error instanceof ApiError
              ? error.message
              : '댓글 생성에 실패했습니다';
          toast.error(message);
        },
      });
    },
    [createCommentMutation]
  );

  const handleSubmit = () => {
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

    createComment({ postId, content, password });
  };

  return (
    <div className='mb-12'>
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
            'w-full p-3 mb-4 outline-none border rounded-lg',
            isPasswordValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            password ? 'bg-white' : 'bg-gray-50'
          )}
        />
      )}
      <textarea
        value={content}
        onChange={e => {
          setIsContentValid(true);
          setContent(e.target.value);
        }}
        placeholder='댓글을 작성해주세요'
        className={clsx(
          'w-full p-4 mb-7 resize-none outline-none border rounded-lg overflow-y-hidden',
          isContentValid
            ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            : 'border-red-400 animate-shake',
          content ? 'bg-white' : 'bg-gray-50'
        )}
        rows={4}
      />
      <div className='flex justify-end'>
        <button
          onClick={handleSubmit}
          className={clsx(
            'h-10 flex justify-center items-center px-4 text-white rounded-lg hover:bg-blue-500 cursor-pointer',
            createCommentMutation.isPending ? 'bg-blue-500' : 'bg-blue-600'
          )}
        >
          {createCommentMutation.isPending ? (
            <Loader2 size={18} strokeWidth={3} className='animate-spin' />
          ) : (
            <>
              <Send size={18} className='mr-2' />
              <div className='font-bold'>댓글 작성</div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
