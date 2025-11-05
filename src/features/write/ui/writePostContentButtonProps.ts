import { WritePostContentButton } from '@/features/write/domain/model/writePostContentButton';

export type ButtonContent = {
  type:
    | 'text'
    | 'link'
    | 'table'
    | 'blockquote'
    | 'horizontalRule'
    | 'image'
    | 'imageLarge'
    | 'imageSmall'
    | 'imageCaption'
    | 'imageSubtitle'
    | 'addRow'
    | 'addColumn'
    | 'bgm'
    | 'bgmStartTime';
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
  imageLarge: {
    type: 'imageLarge',
    style: 'w-4 h-4',
  },
  imageSmall: {
    type: 'imageSmall',
    style: 'w-4 h-4',
  },
  imageCaption: {
    type: 'imageCaption',
    style: 'w-4 h-4',
  },
  imageSubtitle: {
    type: 'imageSubtitle',
    style: 'w-5 h-5',
  },
  addRow: {
    type: 'addRow',
    style: 'w-4 h-4',
  },
  addColumn: {
    type: 'addColumn',
    style: 'w-4 h-4',
  },
  bgm: {
    type: 'bgm',
    style: 'w-4 h-4',
  },
  bgmStartTime: {
    type: 'bgmStartTime',
    style: 'w-5 h-5',
  },
};

export interface MarkdownButtonProps {
  type: 'markdown';
  label: string;
  content: ButtonContent;
  markdownBefore: string;
  markdownAfter?: string;
}

export interface TableButtonProps {
  type: 'table';
  label: string;
  content: ButtonContent;
  direction: 'row' | 'column';
}

export interface DirectiveButtonProps {
  type: 'image' | 'bgm';
  label: string;
  content: ButtonContent;
  position: 'attribute' | 'content';
  key?: string;
  value: string;
}

export type WritePostContentButtonProps =
  | MarkdownButtonProps
  | TableButtonProps
  | DirectiveButtonProps;

const writePostContentButtonProps: Record<
  WritePostContentButton['id'],
  WritePostContentButtonProps
> = {
  heading1: {
    type: 'markdown',
    label: '큰 제목',
    content: buttonContents['heading1'],
    markdownBefore: '# ',
  },
  heading2: {
    type: 'markdown',
    label: '중간 제목',
    content: buttonContents['heading2'],
    markdownBefore: '## ',
  },
  heading3: {
    type: 'markdown',
    label: '작은 제목',
    content: buttonContents['heading3'],
    markdownBefore: '### ',
  },
  bold: {
    type: 'markdown',
    label: '굵게',
    content: buttonContents['bold'],
    markdownBefore: '**',
    markdownAfter: '**',
  },
  italic: {
    type: 'markdown',
    label: '기울이기',
    content: buttonContents['italic'],
    markdownBefore: '*',
    markdownAfter: '*',
  },
  strikethrough: {
    type: 'markdown',
    label: '취소선',
    content: buttonContents['strikethrough'],
    markdownBefore: '~~',
    markdownAfter: '~~',
  },
  link: {
    type: 'markdown',
    label: '링크 추가',
    content: buttonContents['link'],
    markdownBefore: '[링크',
    markdownAfter: '](url)',
  },
  table: {
    type: 'markdown',
    label: '표 만들기',
    content: buttonContents['table'],
    markdownBefore: '| 제목1',
    markdownAfter: ' | 제목2 |\n|-------|-------|\n| 내용1 | 내용2 |',
  },
  addRow: {
    type: 'table',
    label: '행 추가하기',
    content: buttonContents['addRow'],
    direction: 'row',
  },
  addColumn: {
    type: 'table',
    label: '열 추가하기',
    content: buttonContents['addColumn'],
    direction: 'column',
  },
  unorderedList: {
    type: 'markdown',
    label: '순서 없는 목록',
    content: buttonContents['unorderedList'],
    markdownBefore: '- 항목 1',
    markdownAfter: '\n- 항목 2\n- 항목 3',
  },
  orderedList: {
    type: 'markdown',
    label: '순서 있는 목록',
    content: buttonContents['orderedList'],
    markdownBefore: '1. 항목 1',
    markdownAfter: '\n2. 항목 2\n3. 항목 3',
  },
  blockquote: {
    type: 'markdown',
    label: '인용문',
    content: buttonContents['blockquote'],
    markdownBefore: '> 내용',
  },
  horizontalRule: {
    type: 'markdown',
    label: '구분선',
    content: buttonContents['horizontalRule'],
    markdownBefore: '---\n',
  },
  image: {
    type: 'markdown',
    label: '이미지',
    content: buttonContents['image'],
    markdownBefore: ':::img{url="',
    markdownAfter: '" size="medium"}\n:::',
  },
  imageLarge: {
    type: 'image',
    label: '이미지 크게',
    content: buttonContents['imageLarge'],
    position: 'attribute',
    key: 'size',
    value: 'large',
  },
  imageSmall: {
    type: 'image',
    label: '이미지 작게',
    content: buttonContents['imageSmall'],
    position: 'attribute',
    key: 'size',
    value: 'medium',
  },
  imageCaption: {
    type: 'image',
    label: '이미지 설명 추가',
    content: buttonContents['imageCaption'],
    position: 'content',
    value: '이미지를 설명해주세요.',
  },
  imageSubtitle: {
    type: 'image',
    label: '이미지 자막 추가',
    content: buttonContents['imageSubtitle'],
    position: 'content',
    value: '#자막은 전체화면에서 한 문장씩 표시됩니다.',
  },
  bgm: {
    type: 'markdown',
    label: 'BGM',
    content: buttonContents['bgm'],
    markdownBefore: '::bgm{youtubeUrl="',
    markdownAfter: '"}\n',
  },
  bgmStartTime: {
    type: 'bgm',
    label: '시작시간 설정',
    content: buttonContents['bgmStartTime'],
    position: 'attribute',
    key: 'startTime',
    value: '5',
  },
};

export function createProps(
  writePostContentButton: WritePostContentButton
): WritePostContentButtonProps {
  return writePostContentButtonProps[writePostContentButton.id];
}
