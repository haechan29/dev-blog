'use client';

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
  const props = useMemo(() => createProps(writePostForm), [writePostForm]);

  const setTitle = useCallback(
    (title: string) => {
      setWritePostForm({ ...writePostForm, title });
    },
    [setWritePostForm, writePostForm]
  );

  const setTags = useCallback(
    (tagsString: string) => {
      const tagsArray = tagsString
        .split('#')
        .map(tag => tag.trim())
        .filter(Boolean);
      setWritePostForm({ ...writePostForm, tags: tagsArray });
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
    writePostFormProps: props,
    setTitle,
    setTags,
    setPassword,
    setContent,
  } as const;
}
