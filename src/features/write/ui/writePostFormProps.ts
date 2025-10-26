import { writePostSteps } from '@/features/write/constants/writePostStep';
import {
  validate,
  WritePostForm,
} from '@/features/write/domain/model/writePostForm';

export type WritePostFormProps = {
  currentStepId: keyof typeof writePostSteps;
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

export function createProps(form: WritePostForm): WritePostFormProps {
  const currentStep = writePostSteps[form.currentStepId];
  const invalidField =
    currentStep.fields.find(field => !validate(form, field)) ?? null;

  return {
    currentStepId: form.currentStepId,
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
