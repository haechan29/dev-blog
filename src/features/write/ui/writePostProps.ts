import { WritePost } from '@/features/write/domain/model/writePost';
import {
  WritePostStepsProps,
  createProps as createStepProps,
} from '@/features/write/ui/writePostStepProps';

export type WritePostProps = {
  title: string;
  tags: string;
  password: string;
  content: string;
  invalidField: 'title' | 'tags' | 'password' | 'content' | null;
  publishResult?: WritePost['publishResult'];
} & WritePostStepsProps;

export function createProps(writePost: WritePost): WritePostProps {
  return {
    title: writePost.title,
    tags: writePost.tags.map(tag => `#${tag}`).join(' '),
    password: writePost.password,
    content: writePost.content,
    invalidField: getInvalidField(writePost),
    ...createStepProps(writePost.currentStepId),
  };
}

function getInvalidField(writePost: WritePost) {
  if (!writePost.isTitleValid) return 'title';
  else if (!writePost.isTagsValid) return 'tags';
  else if (!writePost.isPasswordValid) return 'password';
  else if (!writePost.isContentValid) return 'content';
  return null;
}
