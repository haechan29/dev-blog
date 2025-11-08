'use client';

import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import useWritePostTag from '@/features/write/hooks/useWritePostTag';
import { AppDispatch } from '@/lib/redux/store';
import { setInvalidField, setTags } from '@/lib/redux/write/writePostFormSlice';
import clsx from 'clsx';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

export default function WritePostTag() {
  const {
    writePostForm: {
      draft: { tags: draft },
      tags: { maxTagLength, maxTagsLength, isValid, delimiter },
    },
  } = useWritePostForm();
  const [tagsInner, setTagsInner] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [isFocused, setIsFocused] = useState(false);
  const tagRef = useRef<HTMLInputElement | null>(null);

  const { tag, isTagEmpty, insertTag, updateTag } = useWritePostTag({
    isFocused,
    tags: tagsInner,
    setTags: setTagsInner,
  });
  const isTagTooLong = useMemo(
    () => tag.length > maxTagLength,
    [maxTagLength, tag.length]
  );
  const areTagsTooMany = useMemo(
    () => tagsInner.length > maxTagsLength,
    [maxTagsLength, tagsInner.length]
  );

  const onClick = useCallback(() => tagRef.current?.focus(), []);
  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => {
    insertTag(tag);
    setIsFocused(false);
  }, [insertTag, tag]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTag(e.currentTarget.value);
      dispatch(setInvalidField(null));
    },
    [dispatch, updateTag]
  );

  useEffect(() => {
    setTagsInner(draft);
  }, [draft]);

  useEffect(() => {
    dispatch(setTags(tagsInner));
  }, [dispatch, tagsInner]);

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
        tagsInner.length === 0 && isTagEmpty && 'bg-gray-50'
      )}
      onClick={onClick}
    >
      <div className='flex flex-1 min-w-0 overflow-x-auto scrollbar-hide gap-2 items-center'>
        {tagsInner.map((tag, index) => (
          <div
            key={tag}
            className={clsx(
              'shrink-0 text-sm',
              index < maxTagsLength ? 'text-blue-500' : 'text-red-500'
            )}
          >
            {`${delimiter}${tag}`}
          </div>
        ))}

        <div
          className={clsx(
            'w-fit shrink-0 relative text-sm',
            !isFocused && tagsInner.length > 0 && 'opacity-0'
          )}
        >
          {isTagEmpty ? (
            <span className='text-gray-400'>{`${delimiter}태그`}</span>
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
            (tagsInner.length === 0 ||
              !isFocused ||
              tag.length >= maxTagLength * 0.95) &&
              'hidden'
          )}
        >
          <div>{tagsInner.length}</div>
          <div>/</div>
          <div>{maxTagsLength}</div>
        </div>
      </div>
    </div>
  );
}
