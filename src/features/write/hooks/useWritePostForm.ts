'use client';

import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePostForm } from '@/features/write/domain/model/writePostForm';
import { createProps } from '@/features/write/ui/writePostFormProps';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useWritePostForm({
  currentStepId,
}: {
  currentStepId: keyof typeof writePostSteps;
}) {
  const [writePostForm, setWritePostForm] = useState<WritePostForm>({
    currentStepId,
    shouldValidate: false,
    title: {
      value: '',
      isEmptyAllowed: false,
      maxLength: 50,
    },
    tags: {
      value: [],
      isEmptyAllowed: true,
      maxTagLength: 31,
      maxTagsLength: 10,
      delimeter: '#',
    },
    password: {
      value: '',
      isEmptyAllowed: false,
      maxLength: 20,
    },
    content: {
      value: '',
      isEmptyAllowed: false,
      maxLength: 50_000,
    },
  });

  const writePostFormProps = useMemo(
    () => createProps(writePostForm),
    [writePostForm]
  );

  const setShouldValidate = useCallback((shouldValidate: boolean) => {
    setWritePostForm(prev => ({
      ...prev,
      shouldValidate,
    }));
  }, []);

  const setTitle = useCallback((title: string) => {
    setWritePostForm(prev => ({
      ...prev,
      title: { ...prev.title, value: title },
    }));
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setWritePostForm(prev => ({
      ...prev,
      tags: { ...prev.tags, value: getTags({ ...prev.tags, tags }) },
    }));
  }, []);

  const setPassword = useCallback((password: string) => {
    setWritePostForm(prev => ({
      ...prev,
      password: { ...prev.password, value: password },
    }));
  }, []);

  const setContent = useCallback((content: string) => {
    setWritePostForm(prev => ({
      ...prev,
      content: { ...prev.content, value: content },
    }));
  }, []);

  useEffect(
    () => setWritePostForm(prev => ({ ...prev, currentStepId })),
    [currentStepId]
  );

  return {
    writePostForm: writePostFormProps,
    setShouldValidate,
    setTitle,
    setTags,
    setPassword,
    setContent,
  } as const;
}

function getTags({
  tags,
  maxTagLength: maxLength,
  delimeter,
}: {
  tags: string[];
  maxTagLength: number;
  delimeter: string;
}) {
  const newTags = tags
    .filter(tag => tag.startsWith(delimeter))
    .map(tag => tag.slice(1, maxLength))
    .filter(tag => tag.trim());
  return [...new Set(newTags)];
}
