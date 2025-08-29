'use client';

import React, { useMemo, useState } from 'react';
import { Send } from 'lucide-react';
import clsx from 'clsx';

interface CommentProps {
  postId: string;
}

export default function CommentFormItem({ postId }: CommentProps) {
  const [authorName, setAuthorName] = useState('익명');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isAuthorNameValid, setIsAuthorNameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isContentValid, setIsContentValid] = useState(true);

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
    
    // 댓글 생성
  };

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={authorName}
          onChange={(e) => {
            setIsAuthorNameValid(true);
            setAuthorName(e.target.value);
          }}
          placeholder="이름"
          className={clsx(
            "p-3 outline-none border rounded-lg",
            isAuthorNameValid ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500': 'border-red-400 animate-shake',
            authorName ? 'bg-white' : 'bg-gray-50'
          )}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setIsPasswordValid(true);
            setPassword(e.target.value);
          }}
          placeholder="비밀번호"
          className={clsx(
            "p-3 outline-none border rounded-lg",
            isPasswordValid ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500': 'border-red-400 animate-shake',
            password ? 'bg-white' : 'bg-gray-50'
          )}
        />
      </div>
      <textarea
        value={content}
        onChange={(e) => {
          setIsContentValid(true);
          setContent(e.target.value);
        }}
        placeholder="댓글을 작성해주세요"
        className={clsx(
          "w-full p-4 mb-7 resize-none outline-none border rounded-lg overflow-y-hidden",
          isContentValid ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500': 'border-red-400 animate-shake',
          content ? 'bg-white' : 'bg-gray-50'
        )}
        rows={4}
      />
      <div className="flex justify-end ">
        <button
          onClick={handleSubmit}
          className={clsx(
            "flex items-center px-5 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-500 cursor-pointer",
          )}
        >
          <Send size={18} className='mr-2' />
          <div className='font-bold'>댓글 작성</div>
        </button>
      </div>
    </div>
  );
}