import { WritePostForm } from '@/features/write/domain/model/writePostForm';
import { ContentEditorStatus } from '@/features/write/domain/types/contentEditorStatus';

export default interface WritePost {
  writePostForm: WritePostForm;
  contentEditorStatus: ContentEditorStatus;
}
