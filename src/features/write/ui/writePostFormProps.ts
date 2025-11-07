import { writePostSteps } from '@/features/write/constants/writePostStep';
import WritePost from '@/features/write/domain/model/writePost';
import { WritePostForm } from '@/features/write/domain/model/writePostForm';

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
    delimiter: string;
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
  return {
    currentStepId: writePost.currentStepId,
    title: {
      value: form.title.value,
      isValid: form.invalidField !== 'title',
      maxLength: form.title.maxLength,
    },
    tags: {
      value: form.tags.value,
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
      isValid: form.invalidField !== 'content',
      maxLength: form.content.maxLength,
    },
  };
}
