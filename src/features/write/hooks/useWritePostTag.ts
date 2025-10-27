'use client';

import { SetState } from '@/types/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useWritePostTag({
  tags,
  isFocused,
  maxTagLength,
  maxTagsLength,
  delimiter,
  setTags,
}: {
  tags: string[];
  isFocused: boolean;
  maxTagLength: number;
  maxTagsLength: number;
  delimiter: string;
  setTags: SetState<string[]>;
}) {
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
  }, [setTag, setTags, tags]);

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
