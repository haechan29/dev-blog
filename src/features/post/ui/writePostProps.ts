import WritePost from '@/features/post/domain/model/writePost';
import { ContentEditorStatus } from '@/features/write/domain/types/contentEditorStatus';
import {
  createProps as createFormProps,
  WritePostFormProps,
} from '@/features/write/ui/writePostFormProps';

export interface WritePostProps {
  writePostForm: WritePostFormProps;
  contentEditorStatus: ContentEditorStatus;
}

export function createProps(writePost: WritePost): WritePostProps {
  return {
    writePostForm: createFormProps(writePost.writePostForm),
    contentEditorStatus: writePost.contentEditorStatus,
  };
}
