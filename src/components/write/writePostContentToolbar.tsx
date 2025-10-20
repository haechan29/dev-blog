'use client';

const buttonStyles = {
  default:
    'shrink-0 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer',
  bold: 'shrink-0 px-3 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-50 cursor-pointer',
  italic:
    'shrink-0 px-3 py-1 text-sm italic border border-gray-300 rounded hover:bg-gray-50 cursor-pointer',
  strikethrough:
    'shrink-0 px-3 py-1 text-sm line-through border border-gray-300 rounded hover:bg-gray-50 cursor-pointer',
};

export type ToolbarButton = {
  id: string;
  label: string;
  actionType: 'insert' | 'toggle';
  markdownBefore: string;
  markdownAfter?: string;
  buttonStyle: keyof typeof buttonStyles;
};

const toolbarButtons: ToolbarButton[] = [
  {
    id: 'heading1',
    label: '제목1',
    actionType: 'insert',
    markdownBefore: '# ',
    buttonStyle: 'default',
  },
  {
    id: 'heading2',
    label: '제목2',
    actionType: 'insert',
    markdownBefore: '## ',
    buttonStyle: 'default',
  },
  {
    id: 'heading3',
    label: '제목3',
    actionType: 'insert',
    markdownBefore: '### ',
    buttonStyle: 'default',
  },
  {
    id: 'bold',
    label: 'B',
    actionType: 'toggle',
    markdownBefore: '**',
    markdownAfter: '**',
    buttonStyle: 'bold',
  },
  {
    id: 'italic',
    label: 'I',
    actionType: 'toggle',
    markdownBefore: '*',
    markdownAfter: '*',
    buttonStyle: 'italic',
  },
  {
    id: 'strikethrough',
    label: '취소선',
    actionType: 'toggle',
    markdownBefore: '~~',
    markdownAfter: '~~',
    buttonStyle: 'strikethrough',
  },
  {
    id: 'link',
    label: '링크',
    actionType: 'insert',
    markdownBefore: '[링크',
    markdownAfter: '](url)',
    buttonStyle: 'default',
  },
  {
    id: 'table',
    label: '테이블',
    actionType: 'insert',
    markdownBefore: '| 헤더1',
    markdownAfter: ' | 헤더2 |\n|-------|-------|\n| 내용1 | 내용2 |',
    buttonStyle: 'default',
  },
  {
    id: 'bgm',
    label: 'BGM',
    actionType: 'insert',
    markdownBefore: '<iframe src="youtube.com/embed/" />',
    buttonStyle: 'default',
  },
];

export default function WritePostContentToolbar({
  onAction,
}: {
  onAction: ({
    actionType,
    markdownBefore,
    markdownAfter,
  }: ToolbarButton) => void;
}) {
  return (
    <div className='w-full flex overflow-x-auto scrollbar-hide border-t border-x border-gray-200 rounded-t-lg gap-4 p-3'>
      {toolbarButtons.map(button => (
        <button
          key={button.id}
          onClick={() => onAction(button)}
          className={buttonStyles[button.buttonStyle]}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
