'use client';

import { writePostSteps } from '@/features/write/constants/writePostStep';
import {
  validate,
  WritePostForm,
} from '@/features/write/domain/model/writePostForm';
import { createProps } from '@/features/write/ui/writePostFormProps';
import { update } from '@/types/react';
import { useRouter } from 'next/navigation';
import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
      maxTagLength: 30,
      maxTagsLength: 10,
      delimiter: '#',
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

  const setTitle = useCallback((action: SetStateAction<string>) => {
    setWritePostForm(prev => ({
      ...prev,
      title: {
        ...prev.title,
        value: update(action, prev.title.value),
      },
    }));
  }, []);

  const setTags = useCallback((action: SetStateAction<string[]>) => {
    setWritePostForm(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        value: update(action, prev.tags.value),
      },
    }));
  }, []);

  const setPassword = useCallback((action: SetStateAction<string>) => {
    setWritePostForm(prev => ({
      ...prev,
      password: {
        ...prev.password,
        value: update(action, prev.password.value),
      },
    }));
  }, []);

  const setContent = useCallback((action: SetStateAction<string>) => {
    setWritePostForm(prev => ({
      ...prev,
      content: { ...prev.content, value: update(action, prev.content.value) },
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
