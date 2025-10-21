import { WritePostContent } from '@/features/write/domain/model/writePostContent';
import {
  WritePostContentButtonProps,
  createProps as createContentButtonProps,
} from '@/features/write/ui/writePostContentButtonProps';
import {
  WritePostContentToolbarProps,
  createProps as createContentToolbarProps,
} from '@/features/write/ui/writePostContentToolbarProps';

export type WritePostContentProps = {
  contentToolbar: WritePostContentToolbarProps;
  contentButtons: WritePostContentButtonProps[];
};

export function createProps(
  writePostContent: WritePostContent
): WritePostContentProps {
  return {
    contentToolbar: createContentToolbarProps(writePostContent.contentToolbar),
    contentButtons: writePostContent.contentButtons.map(
      createContentButtonProps
    ),
  };
}
