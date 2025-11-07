'use client';

import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export default function useWritePostTag({
  isFocused,
  tags,
  setTags,
}: {
  isFocused: boolean;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
}) {
  const {
    writePostForm: {
      tags: { maxTagLength, maxTagsLength, delimiter },
    },
  } = useWritePostForm();
  const [tag, setTag] = useState(delimiter);
  const isTagEmpty = useMemo(() => tag === delimiter, [delimiter, tag]);

  const insertTag = useCallback(
    (tag: string) => {
      const newTags = tag
        .split(/\s+/)
        .map(tag => (tag.startsWith(delimiter) ? tag.slice(1) : tag))
        .map(tag => tag.slice(0, maxTagLength))
        .filter(tag => tag.trim());

      setTags(prev => [...new Set([...prev, ...newTags])]);
      setTag(delimiter);
    },
    [delimiter, maxTagLength, setTags]
  );

  const deleteTag = useCallback(() => {
    if (tags.length === 0) return;
    setTag(tags.pop()!);
    setTags(tags);
  }, [setTags, tags]);

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
    if (!isFocused) {
      setTags(prev => prev.slice(0, maxTagsLength));
    }
  }, [isFocused, maxTagsLength, setTags]);

  return {
    tag,
    isTagEmpty,
    setTag,
    insertTag,
    updateTag,
  } as const;
}
