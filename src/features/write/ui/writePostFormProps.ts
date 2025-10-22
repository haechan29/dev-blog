import { WritePostForm } from '@/features/write/domain/model/writePostForm';

export type WritePostFormProps = {
  title: string;
  tags: string[];
  password: string;
  content: string;
};

export function createProps(form: WritePostForm): WritePostFormProps {
  return {
    ...form,
    tags: form.tags.map(tag => `#${tag}`),
  };
}
