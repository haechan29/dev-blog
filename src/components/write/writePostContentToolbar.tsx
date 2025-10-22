'use client';

import {
  ButtonContent,
  WritePostContentButtonProps,
} from '@/features/write/ui/writePostContentButtonProps';
import clsx from 'clsx';
import { Grid2x2, Link } from 'lucide-react';
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
        'w-full flex px-2 py-1 gap-1 overflow-x-auto scrollbar-hide border-gray-200',
        'transition-transform duration-300 ease-in-out',
        'translate-y-[var(--toolbar-translate-y)]',
        shouldAttachToolbarToBottom
          ? 'fixed inset-x-0 w-screen top-[100%] bg-white/80 backdrop-blur-md touch-pan-x'
          : 'rounded-t-lg border-t border-x'
      )}
      style={{
        '--toolbar-translate-y': toolbarTranslateY,
      }}
    >
      {contentButtons.map(button => (
        <button
          key={`${button.content.type}-${button.content.value}`}
          onClick={() => onToolbarButtonClick(button)}
          className='min-w-10 h-10 flex items-center justify-center shrink-0 p-2 rounded hover:bg-gray-100 cursor-pointer'
        >
          <ContentButton buttonContent={button.content} />
        </button>
      ))}
    </div>
  );
}

function ContentButton({
  buttonContent: { type, style, value },
}: {
  buttonContent: ButtonContent;
}) {
  return type === 'text' ? (
    <div className={style}>{value}</div>
  ) : type === 'link' ? (
    <Link className={style} />
  ) : type === 'table' ? (
    <Grid2x2 className={style} />
  ) : null;
}
