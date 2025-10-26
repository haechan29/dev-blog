'use client';

import useWritePostTag from '@/features/write/hooks/useWritePostTag';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';

export default function WritePostTag({
  tags: { value: tags, maxTagLength, maxTagsLength, isValid },
  setTags,
  resetInvalidField,
}: {
  tags: WritePostFormProps['tags'];
  setTags: (tags: string[]) => void;
  resetInvalidField: () => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const tagRef = useRef<HTMLInputElement | null>(null);
  const { tag, isTagEmpty, insertTag, updateTag } = useWritePostTag({
    tags,
    setTags,
  });
  const isTagTooLong = useMemo(
    () => tag.length > maxTagLength,
    [maxTagLength, tag.length]
  );
  const areTagsTooMany = useMemo(
    () => tags.length > maxTagsLength,
    [maxTagsLength, tags.length]
  );

  const onClick = useCallback(() => tagRef.current?.focus(), []);
  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => {
    insertTag(tag);
    setIsFocused(false);
  }, [insertTag, tag]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTag(e.target.value);
      resetInvalidField();
    },
    [resetInvalidField, updateTag]
  );

  return (
    <div
      className={clsx(
        'w-full flex border rounded-lg items-center gap-3 p-3',
        !isValid || areTagsTooMany || isTagTooLong
          ? 'border-red-400 animate-shake'
          : isFocused
          ? 'border-blue-500'
          : 'border-gray-200 hover:border-blue-500',
        isTagEmpty && 'text-gray-400',
        tags.length === 0 && isTagEmpty && 'bg-gray-50'
      )}
      onClick={onClick}
    >
      <div className='flex flex-1 min-w-0 overflow-x-auto scrollbar-hide gap-2 items-center'>
        {tags.map((tag, index) => (
          <div
            key={tag}
            className={clsx(
              'shrink-0 text-sm',
              index < maxTagsLength ? 'text-blue-500' : 'text-red-500'
            )}
          >
            {tag}
          </div>
        ))}

        <div
          className={clsx(
            'w-fit shrink-0 relative text-sm',
            !isFocused && tags.length > 0 && 'opacity-0'
          )}
        >
          {isTagEmpty ? (
            <span className='text-gray-400'>#태그</span>
          ) : (
            <>
              <span>{tag.slice(0, maxTagLength)}</span>
              <span className='text-red-500'>{tag.slice(maxTagLength)}</span>
            </>
          )}
          <input
            ref={tagRef}
            type='text'
            onFocus={onFocus}
            onBlur={onBlur}
            value={tag}
            onChange={onChange}
            className='absolute z-50 inset-0 outline-none text-transparent caret-gray-900'
          />
        </div>
      </div>

      <div className='shrink-0'>
        <div
          className={clsx(
            'flex text-sm gap-0.5 items-center',
            isTagTooLong && 'text-red-500',
            tag.length < maxTagLength * 0.95 && 'hidden'
          )}
        >
          <div>{tag.length - 1}</div>
          <div>/</div>
          <div>{maxTagLength - 1}</div>
        </div>

        <div
          className={clsx(
            'flex text-sm gap-0.5 items-center',
            areTagsTooMany ? 'text-red-500' : 'text-blue-500',
            (tags.length === 0 || tag.length >= maxTagLength * 0.95) && 'hidden'
          )}
        >
          <div>{tags.length}</div>
          <div>/</div>
          <div>{maxTagsLength}</div>
        </div>
      </div>
    </div>
  );
}
