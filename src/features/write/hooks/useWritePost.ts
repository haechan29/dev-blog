'use client';

import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePost } from '@/features/write/domain/model/writePost';
import {
  validate,
  WritePostForm,
} from '@/features/write/domain/model/writePostForm';
import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import useWritePostValidity from '@/features/write/hooks/useWritePostValidity';
import {
  createProps,
  WritePostProps,
} from '@/features/write/ui/writePostProps';
import {
  createProps as createToolbarProps,
  WritePostToolbarProps,
} from '@/features/write/ui/writePostToolbarProps';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useWritePost({
  currentStepId,
}: {
  currentStepId: keyof typeof writePostSteps;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [writePost, setWritePost] = useState<WritePost>({
    currentStepId,
    shouldValidate: false,
  });

  const [writePostForm, setWritePostForm] = useState<WritePostForm>({
    title: '',
    tags: [],
    password: '',
    content: '',
  });

  const writePostProps: WritePostProps = useMemo(
    () => createProps(writePost),
    [writePost]
  );

  const writePostToolbarProps: WritePostToolbarProps = useMemo(
    () => createToolbarProps(writePost),
    [writePost]
  );

  const { writePostFormProps, setTitle, setTags, setPassword, setContent } =
    useWritePostForm({
      writePostForm,
      setWritePostForm,
    });

  const { writePostValidity, validateFields } = useWritePostValidity({
    writePost,
    writePostForm,
  });

  const setShouldValidate = useCallback((shouldValidate: boolean) => {
    setWritePost(prev => ({ ...prev, shouldValidate }));
  }, []);

  const handleAction = useCallback(() => {
    const currentStep = writePostSteps[writePost.currentStepId];
    switch (currentStep.action) {
      case 'next':
        const params = new URLSearchParams(searchParams);
        params.set('step', 'upload');
        router.push(`${pathname}?${params.toString()}`);
        break;
      case 'publish':
        console.log('게시글이 생성되었습니다');
        break;
    }
  }, [pathname, router, searchParams, writePost.currentStepId]);

  const onAction = useCallback(() => {
    const isValid = validateFields();
    if (!isValid) return;
    handleAction();
  }, [handleAction, validateFields]);

  useEffect(() => {
    setWritePost(prev => ({ ...prev, currentStepId, shouldValidate: false }));
  }, [currentStepId]);

  useEffect(() => {
    for (const step of Object.values(writePostSteps)) {
      if (writePost.currentStepId === step.id) return;
      const isValid = validate(writePostForm, ...step.fields);
      if (!isValid) {
        router.push(`/write?step=${step.id}`);
      }
    }
  }, [router, writePost.currentStepId, writePostForm]);

  return {
    writePost: writePostProps,
    writePostToolbar: writePostToolbarProps,
    writePostForm: writePostFormProps,
    writePostValidity,
    setTitle,
    setTags,
    setPassword,
    setContent,
    setShouldValidate,
    onAction,
  };
}
