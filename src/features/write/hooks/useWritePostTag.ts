'use client';

import { useCallback, useMemo, useState } from 'react';

export default function useWritePostTag({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
}) {
  const [tag, setTag] = useState('#');
  const isTagEmpty = useMemo(() => tag === '#', [tag]);

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

  return {
    tag,
    isTagEmpty,
    setTag,
    insertTag,
    updateTag,
  } as const;
}

function getTags(tag: string): string[] {
  return tag
    .split(/\s+/)
    .filter(tag => tag.trim())
    .map(tag => (tag.startsWith('#') ? tag : `#${tag}`));
}
