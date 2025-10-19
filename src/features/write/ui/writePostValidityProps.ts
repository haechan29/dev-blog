import { WritePost } from '@/features/write/domain/model/writePost';
import {
  validate,
  WritePostForm,
} from '@/features/write/domain/model/writePostForm';

export interface WritePostValidityProps {
  isContentValid: boolean;
  invalidMeta: 'title' | 'tags' | 'password' | null;
}

export function createProps(
  writePost: WritePost,
  writePostForm: WritePostForm
): WritePostValidityProps {
  return {
    isContentValid:
      !writePost.shouldValidate || validate(writePostForm, 'content'),
    invalidMeta: getInvalidField(writePost, writePostForm),
  };
}

function getInvalidField(
  writePost: WritePost,
  writePostForm: WritePostForm
): WritePostValidityProps['invalidMeta'] {
  if (!writePost.shouldValidate) return null;
  else if (!validate(writePostForm, 'title')) return 'title';
  else if (!validate(writePostForm, 'tags')) return 'tags';
  else if (!validate(writePostForm, 'password')) return 'password';
  return null;
}
