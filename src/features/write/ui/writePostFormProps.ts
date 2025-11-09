import { writePostSteps } from '@/features/write/constants/writePostStep';
import WritePost from '@/features/write/domain/model/writePost';
import { WritePostForm } from '@/features/write/domain/model/writePostForm';

export type WritePostFormProps = {
  currentStepId: keyof typeof writePostSteps;
  title: {
    value: string;
    isUserInput: boolean;
    isValid: boolean;
    maxLength: number;
  };
  tags: {
    value: string[];
    isUserInput: boolean;
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
    isUserInput: boolean;
    isValid: boolean;
    maxLength: number;
  };
  draft: {
    tags: string[];
    title?: string;
    content?: string;
  };
};

export function createProps(
  writePost: WritePost,
  form: WritePostForm
): WritePostFormProps {
  return {
    currentStepId: writePost.currentStepId,
    draft: form.draft,
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
