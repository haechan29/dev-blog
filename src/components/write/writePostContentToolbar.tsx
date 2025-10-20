'use client';

import { Mode } from '@/components/write/writePostContent';
import {
  buttonStyles,
  WritePostEditorProps,
} from '@/features/write/ui/writePostEditorProps';
import clsx from 'clsx';
import { useCallback } from 'react';

export default function WritePostContentToolbar({
  writePostEditors,
  mode,
  onAction,
  setMode,
}: {
  writePostEditors: WritePostEditorProps[];
  mode: Mode;
  onAction: (editor: WritePostEditorProps) => void;
  setMode: (mode: Mode) => void;
}) {
  const onModeButtonClick = useCallback(
    () => setMode(mode === 'edit' ? 'preview' : 'edit'),
    [mode, setMode]
  );

  const onToolbarButtonClick = useCallback(
    (button: WritePostEditorProps) => onAction(button),
    [onAction]
  );

  return (
    <div className='w-full flex border-t border-x border-gray-200 rounded-t-lg p-3 gap-4'>
      <div className='flex lg:hidden gap-4'>
        <Modebutton mode={mode} onModeButtonClick={onModeButtonClick} />
      </div>

      <div
        className={clsx(
          'flex overflow-x-auto scrollbar-hide gap-4',
          mode === 'preview' && 'hidden'
        )}
      >
        <ToolbarButtons
          writePostEditors={writePostEditors}
          onToolbarButtonClick={onToolbarButtonClick}
        />
      </div>
    </div>
  );
}

function Modebutton({
  mode,
  onModeButtonClick,
}: {
  mode: Mode;
  onModeButtonClick: () => void;
}) {
  return (
    <>
      <button
        onClick={onModeButtonClick}
        className={clsx(
          'shrink-0 min-w-20 px-3 py-1 text-sm border border-gray-300 hover:bg-gray-100 rounded cursor-pointer',
          mode === 'preview' && 'bg-gray-100'
        )}
      >
        미리보기
      </button>
      <div
        className={clsx(
          'w-0.5 bg-gray-200 my-1',
          mode === 'preview' && 'hidden'
        )}
      />
    </>
  );
}

function ToolbarButtons({
  writePostEditors,
  onToolbarButtonClick,
}: {
  writePostEditors: WritePostEditorProps[];
  onToolbarButtonClick: (button: WritePostEditorProps) => void;
}) {
  return (
    <>
      {writePostEditors.map(button => (
        <button
          key={button.label}
          onClick={() => onToolbarButtonClick(button)}
          className={buttonStyles[button.buttonStyle]}
        >
          {button.label}
        </button>
      ))}
    </>
  );
}
