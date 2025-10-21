import { WritePostContentToolbar } from '@/features/write/domain/model/writePostContentToolbar';

export type WritePostContentToolbarProps = {
  shouldAttachToBottom: boolean;
  toolbarTranslateY: number;
};

export function createProps(
  contentToolbar: WritePostContentToolbar
): WritePostContentToolbarProps {
  return {
    shouldAttachToBottom: contentToolbar.canTouch,
    toolbarTranslateY:
      contentToolbar.isEditorFocused && contentToolbar.canTouch
        ? contentToolbar.keyboardHeight
        : 0,
  };
}
