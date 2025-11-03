'use client';

import Tooltip from '@/components/tooltip';
import {
  ButtonContent,
  WritePostContentButtonProps,
} from '@/features/write/ui/writePostContentButtonProps';
import clsx from 'clsx';
import {
  AlignCenter,
  Captions,
  Columns,
  Expand,
  Grid2x2,
  ImageIcon,
  Link,
  Minus,
  Quote,
  Rows,
  Shrink,
} from 'lucide-react';
import { useCallback } from 'react';

export default function WritePostContentToolbar({
  shouldAttachToolbarToBottom,
  toolbarTranslateY,
  contentButtons,
  activeType,
  onAction,
}: {
  shouldAttachToolbarToBottom: boolean;
  toolbarTranslateY: string;
  contentButtons: WritePostContentButtonProps[];
  activeType: string;
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
      {contentButtons
        .filter(button => activeType === button.type)
        .map(button => (
          <Tooltip key={button.label} text={button.label} direction='top'>
            <button
              onClick={() => onToolbarButtonClick(button)}
              className='min-w-10 h-10 flex items-center justify-center shrink-0 p-2 rounded hover:bg-gray-100 cursor-pointer'
            >
              <ContentButton buttonContent={button.content} />
            </button>
          </Tooltip>
        ))}
    </div>
  );
}

function ContentButton({
  buttonContent: { type, style, value },
}: {
  buttonContent: ButtonContent;
}) {
  switch (type) {
    case 'text':
      return <div className={style}>{value}</div>;
    case 'link':
      return <Link className={style} />;
    case 'table':
      return <Grid2x2 className={style} />;
    case 'blockquote':
      return <Quote className={style} />;
    case 'horizontalRule':
      return <Minus className={style} />;
    case 'image':
      return <ImageIcon className={style} />;
    case 'imageLarge':
      return <Expand className={style} />;
    case 'imageSmall':
      return <Shrink className={style} />;
    case 'imageCaption':
      return <AlignCenter className={style} />;
    case 'imageSubtitle':
      return <Captions className={style} />;
    case 'addRow':
      return <Rows className={style} />;
    case 'addColumn':
      return <Columns className={style} />;
  }
}
