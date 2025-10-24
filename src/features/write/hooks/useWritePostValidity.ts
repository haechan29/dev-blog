'use client';

import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePost } from '@/features/write/domain/model/writePost';
import {
  validate,
  WritePostForm,
} from '@/features/write/domain/model/writePostForm';
import {
  createProps,
  WritePostValidityProps,
} from '@/features/write/ui/writePostValidityProps';
import { useCallback, useMemo } from 'react';

export default function useWritePostValidity({
  writePost,
  writePostForm,
}: {
  writePost: WritePost;
  writePostForm: WritePostForm;
}) {
  const writePostValidityProps: WritePostValidityProps = useMemo(
    () => createProps(writePost, writePostForm),
    [writePost, writePostForm]
  );

  const validateFields = useCallback(() => {
    const currentStep = writePostSteps[writePost.currentStepId];
    return validate(writePostForm, ...currentStep.fields);
  }, [writePost.currentStepId, writePostForm]);

  return { writePostValidity: writePostValidityProps, validateFields } as const;
}
