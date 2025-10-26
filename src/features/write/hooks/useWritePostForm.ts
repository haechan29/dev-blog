'use client';

import { writePostSteps } from '@/features/write/constants/writePostStep';
import {
  validate,
  WritePostForm,
} from '@/features/write/domain/model/writePostForm';
import { createProps } from '@/features/write/ui/writePostFormProps';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useWritePostForm({
  currentStepId,
}: {
  currentStepId: keyof typeof writePostSteps;
}) {
  const router = useRouter();
  const [writePostForm, setWritePostForm] = useState<WritePostForm>({
    currentStepId,
    invalidField: null,
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

  const getInvalidField = useCallback(() => {
    const currentStep = writePostSteps[writePostForm.currentStepId];
    return (
      currentStep.fields.find(field => !validate(writePostForm, field)) ?? null
    );
  }, [writePostForm]);

  const setInvalidField = useCallback((invalidField: string) => {
    setWritePostForm(prev => ({ ...prev, invalidField }));
  }, []);

  const resetInvalidField = useCallback(() => {
    setWritePostForm(prev => ({ ...prev, invalidField: null }));
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

  useEffect(() => {
    for (const step of Object.values(writePostSteps)) {
      if (writePostForm.currentStepId === step.id) return;
      const isValid = validate(writePostForm, ...step.fields);
      if (!isValid) {
        router.push(`/write?step=${step.id}`);
      }
    }
  }, [router, writePostForm]);

  return {
    writePostForm: writePostFormProps,
    getInvalidField,
    setInvalidField,
    resetInvalidField,
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
