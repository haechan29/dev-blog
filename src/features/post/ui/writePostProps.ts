import WritePost from '@/features/post/domain/model/writePost';
import { ContentEditorStatus } from '@/features/write/domain/types/contentEditorStatus';

export interface WritePostProps {
  contentEditorStatus: ContentEditorStatus;
}

export function createProps(writePost: WritePost): WritePostProps {
  return {
    contentEditorStatus: writePost.contentEditorStatus,
  };
}
