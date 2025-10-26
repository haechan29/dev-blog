import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePost } from '@/features/write/domain/model/writePost';
import {
  validate,
  WritePostForm,
} from '@/features/write/domain/model/writePostForm';

export type WritePostFormProps = {
  title: {
    value: string;
    isValid: boolean;
    maxLength: number;
  };
  tags: {
    value: string[];
    isValid: boolean;
    maxTagLength: number;
    maxTagsLength: number;
  };
  password: {
    value: string;
    isValid: boolean;
    maxLength: number;
  };
  content: {
    value: string;
    isValid: boolean;
    maxLength: number;
  };
};

export function createProps(
  writePost: WritePost,
  form: WritePostForm
): WritePostFormProps {
  const { currentStepId, shouldValidate } = writePost;
  const currentStep = writePostSteps[currentStepId];
  const invalidField = shouldValidate
    ? currentStep.fields.find(field => !validate(form, field)) ?? null
    : null;

  return {
    title: {
      value: form.title.value,
      isValid: invalidField !== 'title',
      maxLength: form.title.maxLength,
    },
    tags: {
      value: form.tags.value.map(tag => `${form.tags.delimeter}${tag}`),
      isValid: invalidField !== 'tags',
      maxTagLength: form.tags.maxTagLength,
      maxTagsLength: form.tags.maxTagsLength,
    },
    password: {
      value: form.password.value,
      isValid: invalidField !== 'password',
      maxLength: form.password.maxLength,
    },
    content: {
      value: form.content.value,
      isValid: invalidField !== 'content',
      maxLength: form.content.maxLength,
    },
  };
}
