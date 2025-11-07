import WritePost from '@/features/post/domain/model/writePost';
import { ContentEditorStatus } from '@/features/write/domain/types/contentEditorStatus';

export interface WritePostPropsProps {
  contentEditorStatus: ContentEditorStatus;
}

export function createProps(writePost: WritePost): WritePostPropsProps {
  return {
    contentEditorStatus: writePost.contentEditorStatus,
  };
}
