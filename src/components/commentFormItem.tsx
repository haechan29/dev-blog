'use client';

import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as CommentService from '@/features/comment/domain/service/commentService';

export default function CommentFormItem({ postId }: { postId: string }) {
  const [authorName, setAuthorName] = useState('익명');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isAuthorNameValid, setIsAuthorNameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isContentValid, setIsContentValid] = useState(true);

  const queryClient = useQueryClient();

  const createComment = useMutation({
    mutationFn: (params: {
      postId: string;
      authorName: string;
      content: string;
      password: string;
    }) => CommentService.createComment(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setAuthorName('익명');
      setContent('');
      setPassword('');
    },
  });

  const handleSubmit = () => {
    if (!authorName.trim()) {
      setIsAuthorNameValid(false);
      setIsPasswordValid(true);
      setIsContentValid(true);
      return;
    }

    if (!password.trim()) {
      setIsAuthorNameValid(true);
      setIsPasswordValid(false);
      setIsContentValid(true);
      return;
    }

    if (!content.trim()) {
      setIsAuthorNameValid(true);
      setIsPasswordValid(true);
      setIsContentValid(false);
      return;
    }

    createComment.mutate({
      postId: postId,
      authorName: authorName.trim(),
      content: content.trim(),
      password: password.trim(),
    });
  };

  return (
    <div className='mb-12'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
        <input
          type='text'
          value={authorName}
          onChange={e => {
            setIsAuthorNameValid(true);
            setAuthorName(e.target.value);
          }}
          placeholder='이름'
          className={clsx(
            'p-3 outline-none border rounded-lg',
            isAuthorNameValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            authorName ? 'bg-white' : 'bg-gray-50'
          )}
        />
        <input
          type='password'
          value={password}
          onChange={e => {
            setIsPasswordValid(true);
            setPassword(e.target.value);
          }}
          placeholder='비밀번호'
          className={clsx(
            'p-3 outline-none border rounded-lg',
            isPasswordValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            password ? 'bg-white' : 'bg-gray-50'
          )}
        />
      </div>
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
            'w-30 h-10 flex justify-center items-center text-white rounded-lg bg-blue-600 hover:bg-blue-500 cursor-pointer'
          )}
        >
          {createComment.isPending ? (
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
