'use client';

import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useMemo } from 'react';

export default function WritePostTitle({
  writePostForm: { title },
  writePostValidity: { invalidMeta },
  setTitle,
  setShouldValidate,
}: {
  writePostForm: WritePostFormProps;
  writePostValidity: WritePostValidityProps;
  setTitle: (title: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
}) {
  const isInvalid = useMemo(() => invalidMeta === 'title', [invalidMeta]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setShouldValidate(false);
      setTitle(e.target.value);
    },
    [setShouldValidate, setTitle]
  );

  return (
    <div className='mb-4'>
      <input
        type='text'
        value={title}
        onChange={onChange}
        placeholder='제목을 입력하세요'
        className={clsx(
          'w-full p-4 text-2xl font-bold outline-none border rounded-lg',
          isInvalid
            ? 'border-red-400 animate-shake'
            : 'border-gray-200 hover:border-blue-500 focus:border-blue-500',
          title ? 'bg-white' : 'bg-gray-50'
        )}
      />
    </div>
  );
}
