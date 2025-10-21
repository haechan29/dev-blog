import { WritePostContentButton } from '@/features/write/domain/model/writePostContentButton';

export const buttonStyles = {
  default:
    'shrink-0 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer',
  bold: 'shrink-0 px-3 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-100 cursor-pointer',
  italic:
    'shrink-0 px-3 py-1 text-sm italic border border-gray-300 rounded hover:bg-gray-100 cursor-pointer',
  strikethrough:
    'shrink-0 px-3 py-1 text-sm line-through border border-gray-300 rounded hover:bg-gray-100 cursor-pointer',
};

export type WritePostContentButtonProps = {
  label: string;
  actionType: 'insert' | 'toggle';
  buttonStyle: keyof typeof buttonStyles;
  markdownBefore: string;
  markdownAfter?: string;
};

const writePostContentButtonProps: Record<
  WritePostContentButton['id'],
  WritePostContentButtonProps
> = {
  heading1: {
    label: '제목1',
    actionType: 'insert',
    buttonStyle: 'default',
    markdownBefore: '# ',
  },
  heading2: {
    label: '제목2',
    actionType: 'insert',
    buttonStyle: 'default',
    markdownBefore: '## ',
  },
  heading3: {
    label: '제목3',
    actionType: 'insert',
    buttonStyle: 'default',
    markdownBefore: '### ',
  },
  bold: {
    label: 'B',
    actionType: 'toggle',
    buttonStyle: 'bold',
    markdownBefore: '**',
    markdownAfter: '**',
  },
  italic: {
    label: 'I',
    actionType: 'toggle',
    buttonStyle: 'italic',
    markdownBefore: '*',
    markdownAfter: '*',
  },
  strikethrough: {
    label: '취소선',
    actionType: 'toggle',
    buttonStyle: 'strikethrough',
    markdownBefore: '~~',
    markdownAfter: '~~',
  },
  link: {
    label: '링크',
    actionType: 'insert',
    buttonStyle: 'default',
    markdownBefore: '[링크',
    markdownAfter: '](url)',
  },
  table: {
    label: '테이블',
    actionType: 'insert',
    buttonStyle: 'default',
    markdownBefore: '| 헤더1',
    markdownAfter: ' | 헤더2 |\n|-------|-------|\n| 내용1 | 내용2 |',
  },
};

export function createProps(
  writePostContentButton: WritePostContentButton
): WritePostContentButtonProps {
  return writePostContentButtonProps[writePostContentButton.id];
}
