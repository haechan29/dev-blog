'use client';

import {
  buttonStyles,
  WritePostContentButtonProps,
} from '@/features/write/ui/writePostContentButtonProps';
import clsx from 'clsx';
import { useCallback } from 'react';

export default function WritePostContentToolbar({
  shouldAttachToolbarToBottom,
  toolbarTranslateY,
  contentButtons,
  onAction,
}: {
  shouldAttachToolbarToBottom: boolean;
  toolbarTranslateY: string;
  contentButtons: WritePostContentButtonProps[];
  onAction: (editor: WritePostContentButtonProps) => void;
}) {
  const onToolbarButtonClick = useCallback(
    (button: WritePostContentButtonProps) => onAction(button),
    [onAction]
  );

  return (
    <div
      onMouseDown={e => e.preventDefault()} // prevent keyboard from closing
      onTouchStart={e => e.preventDefault()} // prevent keyboard from closing
      className={clsx(
        'w-full flex p-3 gap-4 overflow-x-auto scrollbar-hide',
        'border-gray-200',
        'transition-transform duration-300 ease-in-out',
        'translate-y-[var(--toolbar-translate-y)]',
        shouldAttachToolbarToBottom
          ? 'fixed inset-x-0 top-[100%] bg-white/80 backdrop-blur-md'
          : 'rounded-t-lg border-t border-x'
      )}
      style={{
        '--toolbar-translate-y': toolbarTranslateY,
      }}
    >
      {contentButtons.map(button => (
        <button
          key={button.label}
          onClick={() => onToolbarButtonClick(button)}
          className={buttonStyles[button.buttonStyle]}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
