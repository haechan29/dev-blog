'use client';

import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useMemo } from 'react';

export default function WritePostTag({
  writePostForm: { tags },
  writePostValidity: { invalidMeta },
  setTags,
  setShouldValidate,
}: {
  writePostForm: WritePostFormProps;
  writePostValidity: WritePostValidityProps;
  setTags: (tags: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
}) {
  const isInvalid = useMemo(() => invalidMeta === 'tags', [invalidMeta]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setShouldValidate(false);
      setTags(e.target.value);
    },
    [setShouldValidate, setTags]
  );

  return (
    <div className='mb-4'>
      <input
        type='text'
        value={tags}
        onChange={onChange}
        placeholder='#태그를 입력하세요'
        className={clsx(
          'w-full p-3 outline-none border rounded-lg',
          isInvalid
            ? 'border-red-400 animate-shake'
            : 'border-gray-200 hover:border-blue-500 focus:border-blue-500',
          tags.length > 0 ? 'bg-white' : 'bg-gray-50'
        )}
      />
    </div>
  );
}
