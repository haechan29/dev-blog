import WritePost from '@/features/write/domain/model/writePost';
import { WritePostContentToolbar } from '@/features/write/domain/model/writePostContentToolbar';

export type WritePostContentToolbarProps = {
  shouldAttachToolbarToBottom: boolean;
  toolbarTranslateY: string;
};

export function createProps(
  writePost: WritePost,
  contentToolbar: WritePostContentToolbar
): WritePostContentToolbarProps {
  return {
    shouldAttachToolbarToBottom: contentToolbar.canTouch,
    toolbarTranslateY:
      writePost.contentEditorStatus.isFocused && contentToolbar.canTouch
        ? `calc(${-contentToolbar.keyboardHeight}px - 100%)`
        : '0px',
  };
}
