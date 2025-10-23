'use client';

import useWritePostTag from '@/features/write/hooks/useWritePostTag';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

export const MAX_TAG_LENGTH = 31;
const MAX_TAGS_LENGTH = 10;

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
  const { tag, isTagEmpty, insertTag, updateTag } = useWritePostTag({
    tags,
    setTags,
  });

  const isTagTooLong = useMemo(() => tag.length > MAX_TAG_LENGTH, [tag.length]);
  const areTagsTooMany = useMemo(
    () => tags.length > MAX_TAGS_LENGTH,
    [tags.length]
  );

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => {
    insertTag(tag);
    setIsFocused(false);
  }, [insertTag, tag]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTag(e.target.value);
      setShouldValidate(false);
    },
    [setShouldValidate, updateTag]
  );

  return (
    <div
      className={clsx(
        'flex w-full border rounded-lg gap-2 items-center px-3',
        isInvalid || areTagsTooMany || isTagTooLong
          ? 'border-red-400 animate-shake'
          : isFocused
          ? 'border-blue-500'
          : 'border-gray-200 hover:border-blue-500',
        isTagEmpty && 'text-gray-400',
        tags.length === 0 && isTagEmpty && 'bg-gray-50'
      )}
    >
      {tags.map((tag, index) => (
        <div
          key={tag}
          className={clsx(
            'shrink-0 text-sm',
            index < MAX_TAGS_LENGTH ? 'text-blue-500' : 'text-red-500'
          )}
        >
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
          className={'py-3 flex-1 min-w-0 outline-none'}
        />

        {isTagEmpty && (
          <div className='flex w-0 overflow-x-visible absolute left-0 inset-y-0 py-3 items-center text-gray-400'>
            <div className='shrink-0 invisible'>#</div>
            <div className='shrink-0'>태그</div>
          </div>
        )}

        {isTagTooLong && (
          <div className='flex w-0 overflow-x-visible absolute left-0 inset-y-0 py-3 items-center text-red-500'>
            <div className='shrink-0 invisible'>
              {tag.slice(0, MAX_TAG_LENGTH)}
            </div>
            <div className='shrink-0'>{tag.slice(MAX_TAG_LENGTH)}</div>
          </div>
        )}
      </div>

      <div
        className={clsx(
          'flex text-sm gap-0.5 items-center',
          isTagTooLong && 'text-red-500',
          (!isFocused || tag.length < MAX_TAG_LENGTH * 0.95) && 'hidden'
        )}
      >
        <div>{tag.length - 1}</div>
        <div>/</div>
        <div>{MAX_TAG_LENGTH - 1}</div>
      </div>

      <div
        className={clsx(
          'flex text-sm gap-0.5 items-center',
          areTagsTooMany ? 'text-red-500' : 'text-blue-500',
          (tags.length === 0 || !isTagEmpty) && 'hidden'
        )}
      >
        <div>{tags.length}</div>
        <div>/</div>
        <div>{MAX_TAGS_LENGTH}</div>
      </div>
    </div>
  );
}
