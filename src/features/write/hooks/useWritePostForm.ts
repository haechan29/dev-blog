'use client';

import {
  maxLengths,
  TAG_DELIMETER,
} from '@/features/write/constants/writePostForm';
import { WritePostForm } from '@/features/write/domain/model/writePostForm';
import { createProps } from '@/features/write/ui/writePostFormProps';
import { useCallback, useMemo } from 'react';

export default function useWritePostForm({
  writePostForm,
  setWritePostForm,
}: {
  writePostForm: WritePostForm;
  setWritePostForm: (form: WritePostForm) => void;
}) {
  const writePostFormProps = useMemo(
    () => createProps(writePostForm),
    [writePostForm]
  );

  const setTitle = useCallback(
    (title: string) => {
      setWritePostForm({ ...writePostForm, title });
    },
    [setWritePostForm, writePostForm]
  );

  const setTags = useCallback(
    (tagsArray: string[]) => {
      const tags = tagsArray
        .filter(tag => tag.startsWith(TAG_DELIMETER))
        .map(tag => tag.slice(1, maxLengths['tag']))
        .filter(tag => tag.trim());
      setWritePostForm({ ...writePostForm, tags: [...new Set(tags)] });
    },
    [setWritePostForm, writePostForm]
  );

  const setPassword = useCallback(
    (password: string) => {
      setWritePostForm({ ...writePostForm, password });
    },
    [setWritePostForm, writePostForm]
  );

  const setContent = useCallback(
    (content: string) => {
      setWritePostForm({ ...writePostForm, content });
    },
    [setWritePostForm, writePostForm]
  );

  return {
    writePostFormProps,
    setTitle,
    setTags,
    setPassword,
    setContent,
  } as const;
}
