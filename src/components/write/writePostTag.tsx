'use client';

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
  const [tag, setTag] = useState('#');
  const [isFocused, setIsFocused] = useState(false);
  const isInvalid = useMemo(() => invalidMeta === 'tags', [invalidMeta]);
  const isTagEmpty = useMemo(() => tag === '#', [tag]);

  const insertTag = useCallback(
    (tag: string) => {
      setTags([...tags, ...getTags(tag)]);
      setTag('#');
    },
    [setTags, tags]
  );

  const deleteTag = useCallback(() => {
    if (tags.length === 0) return;
    setTag(tags.pop()!);
    setTags(tags);
  }, [setTags, tags]);

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => {
    insertTag(tag);
    setIsFocused(false);
  }, [insertTag, tag]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const currentValue = e.target.value;
      if (currentValue && !currentValue.startsWith('#')) return;

      const shouldInsertTag = currentValue.includes(' ');
      const shouldDeleteTag = currentValue === '';

      if (shouldInsertTag) {
        insertTag(currentValue);
      } else if (shouldDeleteTag) {
        deleteTag();
      } else {
        setTag(currentValue);
      }
      setShouldValidate(false);
    },
    [deleteTag, insertTag, setShouldValidate]
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

function getTags(tag: string): string[] {
  return tag
    .split(/\s+/)
    .filter(tag => tag.trim())
    .map(tag => (tag.startsWith('#') ? tag : `#${tag}`));
}
