import { WritePostContentButton } from '@/features/write/domain/model/writePostContentButton';
import { WritePostContentToolbar } from '@/features/write/domain/model/writePostContentToolbar';

export interface WritePostContent {
  contentToolbar: WritePostContentToolbar;
  contentButtons: WritePostContentButton[];
}
