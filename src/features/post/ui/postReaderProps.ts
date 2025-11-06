import PostReader from '@/features/post/domain/model/postReader';

export interface PostReaderProps {
  mode: 'parsed' | 'raw';
  isTableVisible: boolean;
}

export function createProps(postReader: PostReader): PostReaderProps {
  return {
    mode: postReader.mode,
    isTableVisible: postReader.mode === 'parsed',
  };
}
