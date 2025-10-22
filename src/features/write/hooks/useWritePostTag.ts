'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useWritePostTag({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
}) {
  const [tag, setTagInner] = useState('#');
  const isTagEmpty = useMemo(() => tag === '#', [tag]);

  const setTag = useCallback((tag: string) => {
    if (!tag || !tag.startsWith('#')) return;
    setTagInner(tag);
  }, []);

  const insertTag = useCallback(
    (tag: string) => {
      setTags([...tags, ...getTags(tag)]);
      setTag('#');
    },
    [setTag, setTags, tags]
  );

  const deleteTag = useCallback(() => {
    if (tags.length === 0) return;
    setTag(tags.pop()!);
    setTags(tags);
  }, [setTag, setTags, tags]);

  useEffect(() => {
    const shouldInsertTag = tag.includes(' ');
    const shouldDeleteTag = tag === '';

    if (shouldInsertTag) {
      insertTag(tag);
    } else if (shouldDeleteTag) {
      deleteTag();
    }
  }, [deleteTag, insertTag, tag]);

  return {
    tag,
    isTagEmpty,
    setTag,
  } as const;
}

function getTags(tag: string): string[] {
  return tag
    .split(/\s+/)
    .filter(tag => tag.trim())
    .map(tag => (tag.startsWith('#') ? tag : `#${tag}`));
}
