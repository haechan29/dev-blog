'use client';

import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePostForm } from '@/features/write/domain/model/writePostForm';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { RootState } from '@/lib/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useWritePostForm() {
  const { currentStepId } = useSelector((state: RootState) => state.writePost);
  const writePostForm = useSelector((state: RootState) => state.writePostForm);
  const [writePostFormProps, setWritePostFormProps] = useState(
    createProps(currentStepId, writePostForm)
  );

  useEffect(() => {
    const writePostFormProps = createProps(currentStepId, writePostForm);
    setWritePostFormProps(writePostFormProps);
  }, [currentStepId, writePostForm]);

  return {
    writePostForm: writePostFormProps,
  } as const;
}

function createProps(
  currentStepId: keyof typeof writePostSteps,
  form: WritePostForm
): WritePostFormProps {
  return {
    currentStepId,
    isParseError: form.isParseError,
    title: {
      value: form.title.value,
      isUserInput: form.title.isUserInput,
      isValid: form.invalidField !== 'title',
      maxLength: form.title.maxLength,
    },
    tags: {
      value: form.tags.value,
      isUserInput: form.tags.isUserInput,
      isValid: form.invalidField !== 'tags',
      maxTagLength: form.tags.maxTagLength,
      maxTagsLength: form.tags.maxTagsLength,
      delimiter: form.tags.delimiter,
    },
    password: {
      value: form.password.value,
      isValid: form.invalidField !== 'password',
      maxLength: form.password.maxLength,
    },
    content: {
      value: form.content.value,
      isUserInput: form.content.isUserInput,
      isValid: form.invalidField !== 'content',
      maxLength: form.content.maxLength,
    },
  };
}
