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

export function createProps(form: WritePostForm): WritePostFormProps {
  return {
    title: {
      value: form.title.value,
      isValid: validate(form, 'title'),
      maxLength: form.title.maxLength,
    },
    tags: {
      value: form.tags.value.map(tag => `${form.tags.delimeter}${tag}`),
      isValid: validate(form, 'tags'),
      maxTagLength: form.tags.maxTagLength,
      maxTagsLength: form.tags.maxTagsLength,
    },
    password: {
      value: form.password.value,
      isValid: validate(form, 'password'),
      maxLength: form.password.maxLength,
    },
    content: {
      value: form.content.value,
      isValid: validate(form, 'content'),
      maxLength: form.content.maxLength,
    },
  };
}
