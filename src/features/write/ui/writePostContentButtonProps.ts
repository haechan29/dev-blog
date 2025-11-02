import { WritePostContentButton } from '@/features/write/domain/model/writePostContentButton';

export type ButtonContent = {
  type: 'text' | 'link' | 'table' | 'blockquote' | 'horizontalRule' | 'image';
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
    style: 'w-4 h-4',
  },
  table: {
    type: 'table',
    style: 'w-4 h-4',
  },
  unorderedList: {
    type: 'text',
    style: 'text-xl',
    value: '•',
  },
  orderedList: {
    type: 'text',
    style: 'text-sm font-bold',
    value: '1.',
  },
  blockquote: {
    type: 'blockquote',
    style: 'w-4 h-4 fill-gray-900',
  },
  horizontalRule: {
    type: 'horizontalRule',
    style: 'w-5 h-5',
  },
  image: {
    type: 'image',
    style: 'w-4 h-4',
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
  unorderedList: {
    action: 'insert',
    label: '순서 없는 목록',
    content: buttonContents['unorderedList'],
    markdownBefore: '- 항목 1',
    markdownAfter: '\n- 항목 2\n- 항목 3',
  },
  orderedList: {
    action: 'insert',
    label: '순서 있는 목록',
    content: buttonContents['orderedList'],
    markdownBefore: '1. 항목 1',
    markdownAfter: '\n2. 항목 2\n3. 항목 3',
  },
  blockquote: {
    action: 'insert',
    label: '인용문',
    content: buttonContents['blockquote'],
    markdownBefore: '> 내용',
  },
  horizontalRule: {
    action: 'insert',
    label: '구분선',
    content: buttonContents['horizontalRule'],
    markdownBefore: '---\n',
  },
  image: {
    action: 'insert',
    label: '이미지',
    content: buttonContents['image'],
    markdownBefore: ':::img{url="',
    markdownAfter: '" size="medium"}\n:::',
  },
};

export function createProps(
  writePostContentButton: WritePostContentButton
): WritePostContentButtonProps {
  return writePostContentButtonProps[writePostContentButton.id];
}
