'use client';

import { WritePostProps } from '@/features/write/ui/writePostProps';
import clsx from 'clsx';
import { useMemo } from 'react';

export default function WritePostTitle({
  title,
  setTitle,
  invalidField,
}: {
  title: string;
  setTitle: (title: string) => void;
  invalidField: WritePostProps['invalidField'];
}) {
  const isInvalid = useMemo(() => invalidField === 'title', [invalidField]);

  return (
    <div className='mb-4'>
      <input
        type='text'
        value={title}
        onChange={e => setTitle(e.target.value)}
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
