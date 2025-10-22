'use client';

import useWritePostTag from '@/features/write/hooks/useWritePostTag';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

export default function WritePostTag({
  writePostForm: { tags },
  writePostValidity: { invalidMeta },
  setTags,
  setShouldValidate,
}: {
  writePostForm: WritePostFormProps;
  writePostValidity: WritePostValidityProps;
  setTags: (tags: string[]) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isInvalid = useMemo(() => invalidMeta === 'tags', [invalidMeta]);
  const { tag, isTagEmpty, setTag } = useWritePostTag({
    tags,
    setTags,
  });

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => {
    setTag(tag);
    setIsFocused(false);
  }, [setTag, tag]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTag(e.target.value);
      setShouldValidate(false);
    },
    [setShouldValidate, setTag]
  );

  return (
    <div
      className={clsx(
        'flex w-full border rounded-lg gap-2 items-center px-3 hover:border-blue-500',
        isInvalid
          ? 'border-red-400 animate-shake'
          : isFocused
          ? 'border-blue-500'
          : 'border-gray-200',
        isTagEmpty && 'text-gray-400',
        tags.length === 0 && isTagEmpty && 'bg-gray-50'
      )}
    >
      {tags.map(tag => (
        <div key={tag} className='shrink-0 text-sm text-blue-500'>
          {tag}
        </div>
      ))}
      <div
        className={clsx(
          'relative flex flex-1 min-w-0 text-sm',
          !isFocused && tags.length > 0 && 'opacity-0'
        )}
      >
        <input
          type='text'
          onFocus={onFocus}
          onBlur={onBlur}
          value={tag}
          onChange={onChange}
          className='py-3 flex-1 min-w-0 outline-none'
        />
        {isTagEmpty && (
          <div className='absolute left-2 inset-y-0 py-3 text-gray-400'>
            태그
          </div>
        )}
      </div>
    </div>
  );
}
