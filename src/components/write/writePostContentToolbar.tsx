'use client';

import { useCallback } from 'react';

const buttonStyles = {
  default:
    'shrink-0 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer',
  bold: 'shrink-0 px-3 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-50 cursor-pointer',
  italic:
    'shrink-0 px-3 py-1 text-sm italic border border-gray-300 rounded hover:bg-gray-50 cursor-pointer',
  strikethrough:
    'shrink-0 px-3 py-1 text-sm line-through border border-gray-300 rounded hover:bg-gray-50 cursor-pointer',
};

type ToolbarButton = {
  id: string;
  label: string;
  action: string;
  buttonStyle: keyof typeof buttonStyles;
};

const toolbarButtons: ToolbarButton[] = [
  {
    id: 'heading1',
    label: '제목1',
    action: 'insertHeading1',
    buttonStyle: 'default',
  },
  {
    id: 'heading2',
    label: '제목2',
    action: 'insertHeading2',
    buttonStyle: 'default',
  },
  {
    id: 'heading3',
    label: '제목3',
    action: 'insertHeading3',
    buttonStyle: 'default',
  },
  {
    id: 'bold',
    label: 'B',
    action: 'toggleBold',
    buttonStyle: 'bold',
  },
  {
    id: 'italic',
    label: 'I',
    action: 'toggleItalic',
    buttonStyle: 'italic',
  },
  {
    id: 'strikethrough',
    label: '취소선',
    action: 'toggleStrikethrough',
    buttonStyle: 'strikethrough',
  },
  {
    id: 'link',
    label: '링크',
    action: 'insertLink',
    buttonStyle: 'default',
  },
  {
    id: 'bgm',
    label: 'BGM',
    action: 'insertBgm',
    buttonStyle: 'default',
  },
];

export default function WritePostContentToolbar({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  const onAction = useCallback((action: string) => {
    console.log(action);
  }, []);

  return (
    <div className='w-full flex overflow-x-auto scrollbar-hide border-t border-x border-gray-200 rounded-t-lg gap-4 p-3'>
      {toolbarButtons.map(button => (
        <button
          key={button.id}
          onClick={() => onAction(button.action)}
          className={buttonStyles[button.buttonStyle]}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
