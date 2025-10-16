import { WritePost } from '@/features/write/domain/model/writePost';

export type WritePostProps = {
  title: string;
  tags: string;
  password: string;
  content: string;
  invalidField: 'title' | 'tags' | 'password' | 'content' | null;
};

export function createProps(writePost: WritePost): WritePostProps {
  return {
    title: writePost.title,
    tags: writePost.tags.map(tag => `#${tag}`).join(' '),
    password: writePost.password,
    content: writePost.content,
    invalidField: getInvalidField(writePost),
  };
}

function getInvalidField(writePost: WritePost) {
  if (!writePost.isTitleValid) return 'title';
  else if (!writePost.isTagsValid) return 'tags';
  else if (!writePost.isPasswordValid) return 'password';
  else if (!writePost.isContentValid) return 'content';
  return null;
}
