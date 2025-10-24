import { maxLengths } from '@/features/write/constants/writePostForm';

export interface WritePostForm {
  title: string;
  tags: string[];
  password: string;
  content: string;
}

export function validate(
  form: WritePostForm,
  ...fields: (keyof WritePostForm)[]
) {
  return fields.every(field => {
    switch (field) {
      case 'title': {
        const title = form[field];
        return title.length > 0 && title.length <= maxLengths['title'];
      }
      case 'tags': {
        const tags = form[field];
        return tags.length <= maxLengths['tags'];
      }
      case 'password': {
        const password = form[field];
        return password.length > 0 && password.length <= maxLengths['password'];
      }
      case 'content': {
        const content = form[field];
        return content.length > 0 && content.length <= maxLengths['content'];
      }
    }
  });
}
