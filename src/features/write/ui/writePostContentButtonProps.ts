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
    content: buttonContents['heading1'],
    markdownBefore: '# ',
  },
  heading2: {
    action: 'insert',
    content: buttonContents['heading2'],
    markdownBefore: '## ',
  },
  heading3: {
    action: 'insert',
    content: buttonContents['heading3'],
    markdownBefore: '### ',
  },
  bold: {
    action: 'toggle',
    content: buttonContents['bold'],
    markdownBefore: '**',
    markdownAfter: '**',
  },
  italic: {
    action: 'toggle',
    content: buttonContents['italic'],
    markdownBefore: '*',
    markdownAfter: '*',
  },
  strikethrough: {
    action: 'toggle',
    content: buttonContents['strikethrough'],
    markdownBefore: '~~',
    markdownAfter: '~~',
  },
  link: {
    action: 'insert',
    content: buttonContents['link'],
    markdownBefore: '[링크',
    markdownAfter: '](url)',
  },
  table: {
    action: 'insert',
    content: buttonContents['table'],
    markdownBefore: '| 헤더1',
    markdownAfter: ' | 헤더2 |\n|-------|-------|\n| 내용1 | 내용2 |',
  },
};

export function createProps(
  writePostContentButton: WritePostContentButton
): WritePostContentButtonProps {
  return writePostContentButtonProps[writePostContentButton.id];
}
