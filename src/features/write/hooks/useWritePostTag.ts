'use client';

import useWritePost from '@/features/write/hooks/useWritePost';
import { AppDispatch } from '@/lib/redux/store';
import { setTags } from '@/lib/redux/writePostSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useWritePostTag({ isFocused }: { isFocused: boolean }) {
  const {
    writePost: {
      writePostForm: {
        tags: { value: tags, maxTagLength, maxTagsLength, delimiter },
      },
    },
  } = useWritePost();
  const dispatch = useDispatch<AppDispatch>();
  const [tag, setTag] = useState(delimiter);
  const isTagEmpty = useMemo(() => tag === delimiter, [delimiter, tag]);

  const insertTag = useCallback(
    (tag: string) => {
      const newTags = tag
        .split(/\s+/)
        .map(tag => (tag.startsWith(delimiter) ? tag.slice(1) : tag))
        .map(tag => tag.slice(0, maxTagLength))
        .filter(tag => tag.trim());

      dispatch(setTags([...new Set([...tags, ...newTags])]));
      setTag(delimiter);
    },
    [delimiter, dispatch, maxTagLength, tags]
  );

  const deleteTag = useCallback(() => {
    if (tags.length === 0) return;
    setTag(tags.pop()!);
    dispatch(setTags(tags));
  }, [dispatch, tags]);

  const updateTag = useCallback(
    (tag: string) => {
      const shouldInsertTag = tag.includes(' ');
      const shouldDeleteTag = tag === '';

      if (shouldInsertTag) {
        insertTag(tag);
      } else if (shouldDeleteTag) {
        deleteTag();
      } else {
        setTag(tag);
      }
    },
    [deleteTag, insertTag]
  );

  useEffect(() => {
    if (!tag.startsWith(delimiter)) {
      setTag(prev => `${delimiter}${prev}`);
    }
  }, [delimiter, tag]);

  useEffect(() => {
    if (!isFocused && tags.length > maxTagsLength) {
      dispatch(setTags(tags.slice(0, maxTagsLength)));
    }
  }, [dispatch, isFocused, maxTagsLength, tags]);

  return {
    tag,
    isTagEmpty,
    setTag,
    insertTag,
    updateTag,
  } as const;
}
