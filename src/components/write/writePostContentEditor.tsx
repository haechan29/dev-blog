'use client';

import clsx from 'clsx';
import { ChangeEvent, useCallback } from 'react';

export default function WritePostContentEditor({
  content,
  isContentValid,
  isError,
  setContent,
  setShouldValidate,
}: {
  content: string;
  isContentValid: boolean;
  isError: boolean;
  setContent: (content: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
}) {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setShouldValidate(false);
      setContent(e.target.value);
    },
    [setContent, setShouldValidate]
  );

  return (
    <textarea
      value={content}
      onChange={onChange}
      placeholder='본문을 입력하세요'
      className={clsx(
        'w-full p-4 resize-none outline-none border rounded-br-lg lg:rounded-br-none rounded-bl-lg',
        isContentValid && !isError
          ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
          : 'border-red-400 animate-shake',
        content || 'bg-gray-50'
      )}
    />
  );
}
