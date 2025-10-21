import { WritePostContentToolbar } from '@/features/write/domain/model/writePostContentToolbar';

export type WritePostContentToolbarProps = {
  shouldAttachToolbarToBottom: boolean;
  toolbarTranslateY: string;
};

export function createProps(
  contentToolbar: WritePostContentToolbar
): WritePostContentToolbarProps {
  return {
    shouldAttachToolbarToBottom: contentToolbar.canTouch,
    toolbarTranslateY:
      contentToolbar.isEditorFocused && contentToolbar.canTouch
        ? `calc(${-contentToolbar.keyboardHeight}px - 100%`
        : '0px',
  };
}
