'use client';

import { WritePostProps } from '@/features/write/ui/writePostProps';
import clsx from 'clsx';
import { useMemo } from 'react';

export default function WritePostTag({
  tags,
  setTags,
  invalidField,
}: {
  tags: string;
  setTags: (tags: string) => void;
  invalidField: WritePostProps['invalidField'];
}) {
  const isInvalid = useMemo(() => invalidField === 'tags', [invalidField]);

  return (
    <div className='mb-4'>
      <input
        type='text'
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder='#태그를 입력하세요'
        className={clsx(
          'w-full p-3 outline-none border rounded-lg',
          isInvalid
            ? 'border-red-400 animate-shake'
            : 'border-gray-200 hover:border-blue-500 focus:border-blue-500',
          tags ? 'bg-white' : 'bg-gray-50'
        )}
      />
    </div>
  );
}
