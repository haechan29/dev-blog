import { WritePostContentButton } from '@/features/write/domain/model/writePostContentButton';

export type ButtonContent = {
  type: 'text' | 'link' | 'table';
  style: string;
  value?: string;
};

const buttonContents: Record<WritePostContentButton['id'], ButtonContent> = {
  heading1: {
    type: 'text',
    style: 'text-sm font-semibold',
    value: 'H1',
  },
  heading2: {
    type: 'text',
    style: 'text-xs font-semibold',
    value: 'H2',
  },
  heading3: {
    type: 'text',
    style: 'text-xs',
    value: 'H3',
  },
  bold: {
    type: 'text',
    style: 'font-bold',
    value: 'B',
  },
  italic: {
    type: 'text',
    style: 'italic',
    value: 'I',
  },
  strikethrough: {
    type: 'text',
    style: 'line-through',
    value: 'T',
  },
  link: {
    type: 'link',
    style: 'w-[18] h-[18]',
  },
  table: {
    type: 'table',
    style: 'w-5 h-5',
  },
};

export type WritePostContentButtonProps = {
  action: 'insert' | 'toggle';
  label: string;
  content: ButtonContent;
  markdownBefore: string;
  markdownAfter?: string;
};

const writePostContentButtonProps: Record<
  WritePostContentButton['id'],
  WritePostContentButtonProps
> = {
  heading1: {
    action: 'insert',
    label: '큰 제목',
    content: buttonContents['heading1'],
    markdownBefore: '# ',
  },
  heading2: {
    action: 'insert',
    label: '중간 제목',
    content: buttonContents['heading2'],
    markdownBefore: '## ',
  },
  heading3: {
    action: 'insert',
    label: '작은 제목',
    content: buttonContents['heading3'],
    markdownBefore: '### ',
  },
  bold: {
    action: 'toggle',
    label: '굵게',
    content: buttonContents['bold'],
    markdownBefore: '**',
    markdownAfter: '**',
  },
  italic: {
    action: 'toggle',
    label: '기울이기',
    content: buttonContents['italic'],
    markdownBefore: '*',
    markdownAfter: '*',
  },
  strikethrough: {
    action: 'toggle',
    label: '취소선',
    content: buttonContents['strikethrough'],
    markdownBefore: '~~',
    markdownAfter: '~~',
  },
  link: {
    action: 'insert',
    label: '링크 추가',
    content: buttonContents['link'],
    markdownBefore: '[링크',
    markdownAfter: '](url)',
  },
  table: {
    action: 'insert',
    label: '표 만들기',
    content: buttonContents['table'],
    markdownBefore: '| 제목1',
    markdownAfter: ' | 제목2 |\n|-------|-------|\n| 내용1 | 내용2 |',
  },
};

export function createProps(
  writePostContentButton: WritePostContentButton
): WritePostContentButtonProps {
  return writePostContentButtonProps[writePostContentButton.id];
}
