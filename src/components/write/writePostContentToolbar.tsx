'use client';

import {
  buttonStyles,
  WritePostEditorProps,
} from '@/features/write/ui/writePostEditorProps';
import { useCallback } from 'react';

export default function WritePostContentToolbar({
  writePostEditors,
  onAction,
}: {
  writePostEditors: WritePostEditorProps[];
  onAction: ({
    actionType,
    markdownBefore,
    markdownAfter,
  }: WritePostEditorProps) => void;
}) {
  const onClick = useCallback(
    (button: WritePostEditorProps) => onAction(button),
    [onAction]
  );

  return (
    <div className='w-full flex overflow-x-auto scrollbar-hide border-t border-x border-gray-200 rounded-t-lg gap-4 p-3'>
      {writePostEditors.map(button => (
        <button
          key={button.label}
          onClick={() => onClick(button)}
          className={buttonStyles[button.buttonStyle]}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
