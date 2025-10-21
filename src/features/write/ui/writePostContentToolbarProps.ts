import { WritePostContentToolbar } from '@/features/write/domain/model/writePostContentToolbar';

export type WritePostContentToolbarProps = {
  shouldAttachToolbarToBottom: boolean;
  toolbarTranslateY: number;
};

export function createProps(
  contentToolbar: WritePostContentToolbar
): WritePostContentToolbarProps {
  return {
    shouldAttachToolbarToBottom: contentToolbar.canTouch,
    toolbarTranslateY:
      contentToolbar.isEditorFocused && contentToolbar.canTouch
        ? contentToolbar.keyboardHeight
        : 0,
  };
}
