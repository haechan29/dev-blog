'use client';

import { WritePost } from '@/features/write/domain/model/writePost';
import { WritePostForm } from '@/features/write/domain/model/writePostForm';
import { createProps } from '@/features/write/ui/writePostFormProps';
import { useCallback, useMemo } from 'react';

export default function useWritePostForm({
  writePost,
  writePostForm,
  setWritePostForm,
}: {
  writePost: WritePost;
  writePostForm: WritePostForm;
  setWritePostForm: (form: WritePostForm) => void;
}) {
  const writePostFormProps = useMemo(
    () => createProps(writePost, writePostForm),
    [writePost, writePostForm]
  );

  const setTitle = useCallback(
    (newValue: string) => {
      const title = writePostForm.title;
      if (title.value === newValue) return;
      setWritePostForm({
        ...writePostForm,
        title: { ...title, value: newValue },
      });
    },
    [setWritePostForm, writePostForm]
  );

  const setTags = useCallback(
    (newValue: string[]) => {
      const tags = writePostForm.tags;
      const filtered = newValue
        .filter(tag => tag.startsWith(tags.delimeter))
        .map(tag => tag.slice(1, tags.maxTagLength))
        .filter(tag => tag.trim());
      setWritePostForm({
        ...writePostForm,
        tags: { ...tags, value: [...new Set(filtered)] },
      });
    },
    [setWritePostForm, writePostForm]
  );

  const setPassword = useCallback(
    (newValue: string) => {
      const password = writePostForm.password;
      if (password.value === newValue) return;
      setWritePostForm({
        ...writePostForm,
        password: { ...password, value: newValue },
      });
    },
    [setWritePostForm, writePostForm]
  );

  const setContent = useCallback(
    (newValue: string) => {
      const content = writePostForm.content;
      if (content.value === newValue) return;
      setWritePostForm({
        ...writePostForm,
        content: { ...content, value: newValue },
      });
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
