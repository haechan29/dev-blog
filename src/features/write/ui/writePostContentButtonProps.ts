import { WritePostContentButton } from '@/features/write/domain/model/writePostContentButton';

export type ButtonIcon =
  | 'text'
  | 'link'
  | 'table'
  | 'code'
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

export interface ButtonContent {
  icon: ButtonIcon;
  style: string;
  value?: string;
}

export interface MarkdownButtonProps {
  action: 'markdown';
  category: 'default';
  label: string;
  content: ButtonContent;
  isBlock: boolean;
  markdownBefore: string;
  markdownAfter?: string;
}

export interface TableButtonProps {
  action: 'table';
  category: 'table';
  label: string;
  content: ButtonContent;
  direction: 'row' | 'column';
}

export interface CodeButtonProps {
  action: 'code';
  category: 'code';
  label: string;
  content: ButtonContent;
  field: 'language';
}

export interface DirectiveButtonProps {
  action: 'directive';
  category: 'image' | 'bgm';
  label: string;
  content: ButtonContent;
  position: 'attribute' | 'content';
  key?: string;
  value: string;
}

export interface UploadButtonProps {
  action: 'upload';
  category: 'default';
  label: string;
  content: ButtonContent;
}

export type WritePostContentButtonProps =
  | MarkdownButtonProps
  | TableButtonProps
  | CodeButtonProps
  | DirectiveButtonProps
  | UploadButtonProps;

export type ButtonAction = WritePostContentButtonProps['action'];
export type ButtonCategory = WritePostContentButtonProps['category'];

const buttonProps: Record<
  WritePostContentButton['id'],
  WritePostContentButtonProps
> = {
  heading1: {
    action: 'markdown',
    category: 'default',
    label: '큰 제목',
    content: { icon: 'text', style: 'text-sm font-semibold', value: 'H1' },
    isBlock: true,
    markdownBefore: '# 제목',
  },
  heading2: {
    action: 'markdown',
    category: 'default',
    label: '중간 제목',
    content: { icon: 'text', style: 'text-xs font-semibold', value: 'H2' },
    isBlock: true,
    markdownBefore: '## 제목',
  },
  heading3: {
    action: 'markdown',
    category: 'default',
    label: '작은 제목',
    content: { icon: 'text', style: 'text-xs', value: 'H3' },
    isBlock: true,
    markdownBefore: '### 제목',
  },
  bold: {
    action: 'markdown',
    category: 'default',
    label: '굵게',
    content: { icon: 'text', style: 'font-bold', value: 'B' },
    isBlock: false,
    markdownBefore: '**',
    markdownAfter: '**',
  },
  italic: {
    action: 'markdown',
    category: 'default',
    label: '기울이기',
    content: { icon: 'text', style: 'italic', value: 'I' },
    isBlock: false,
    markdownBefore: '*',
    markdownAfter: '*',
  },
  strikethrough: {
    action: 'markdown',
    category: 'default',
    label: '취소선',
    content: { icon: 'text', style: 'line-through', value: 'T' },
    isBlock: false,
    markdownBefore: '~~',
    markdownAfter: '~~',
  },
  link: {
    action: 'markdown',
    category: 'default',
    label: '링크 추가',
    content: { icon: 'link', style: 'w-4 h-4' },
    isBlock: false,
    markdownBefore: '[링크',
    markdownAfter: '](url)',
  },
  code: {
    action: 'markdown',
    category: 'default',
    label: '코드 블록 추가',
    content: { icon: 'code', style: 'w-4 h-4' },
    isBlock: true,
    markdownBefore: '```\n코드를 입력해주세요.',
    markdownAfter: '\n```',
  },
  table: {
    action: 'markdown',
    category: 'default',
    label: '표 만들기',
    content: { icon: 'table', style: 'w-4 h-4' },
    isBlock: true,
    markdownBefore: '| 제목1',
    markdownAfter: ' | 제목2 |\n|-------|-------|\n| 내용1 | 내용2 |',
  },
  addRow: {
    action: 'table',
    category: 'table',
    label: '행 추가하기',
    content: { icon: 'addRow', style: 'w-4 h-4' },
    direction: 'row',
  },
  addColumn: {
    action: 'table',
    category: 'table',
    label: '열 추가하기',
    content: { icon: 'addColumn', style: 'w-4 h-4' },
    direction: 'column',
  },
  unorderedList: {
    action: 'markdown',
    category: 'default',
    label: '순서 없는 목록',
    content: { icon: 'text', style: 'text-xl', value: '•' },
    isBlock: true,
    markdownBefore: '- 항목 1',
    markdownAfter: '\n- 항목 2\n- 항목 3',
  },
  orderedList: {
    action: 'markdown',
    category: 'default',
    label: '순서 있는 목록',
    content: { icon: 'text', style: 'text-sm font-bold', value: '1.' },
    isBlock: true,
    markdownBefore: '1. 항목 1',
    markdownAfter: '\n2. 항목 2\n3. 항목 3',
  },
  blockquote: {
    action: 'markdown',
    category: 'default',
    label: '인용문',
    content: { icon: 'blockquote', style: 'w-4 h-4 fill-gray-900' },
    isBlock: true,
    markdownBefore: '> 내용',
  },
  horizontalRule: {
    action: 'markdown',
    category: 'default',
    label: '구분선',
    content: { icon: 'horizontalRule', style: 'w-5 h-5' },
    isBlock: true,
    markdownBefore: '---',
  },
  image: {
    action: 'upload',
    category: 'default',
    label: '이미지',
    content: { icon: 'image', style: 'w-4 h-4' },
  },
  imageLarge: {
    action: 'directive',
    category: 'image',
    label: '이미지 크게',
    content: { icon: 'imageLarge', style: 'w-4 h-4' },
    position: 'attribute',
    key: 'size',
    value: 'large',
  },
  imageSmall: {
    action: 'directive',
    category: 'image',
    label: '이미지 작게',
    content: { icon: 'imageSmall', style: 'w-4 h-4' },
    position: 'attribute',
    key: 'size',
    value: 'medium',
  },
  imageCaption: {
    action: 'directive',
    category: 'image',
    label: '이미지 설명 추가',
    content: { icon: 'imageCaption', style: 'w-4 h-4' },
    position: 'content',
    value: '이미지를 설명해주세요.',
  },
  imageSubtitle: {
    action: 'directive',
    category: 'image',
    label: '이미지 자막 추가',
    content: { icon: 'imageSubtitle', style: 'w-5 h-5' },
    position: 'content',
    value: '#자막은 전체화면에서 한 문장씩 표시됩니다.',
  },
  bgm: {
    action: 'markdown',
    category: 'default',
    label: 'BGM',
    content: { icon: 'bgm', style: 'w-4 h-4' },
    isBlock: true,
    markdownBefore: '::bgm{youtubeUrl="',
    markdownAfter: '"}\n',
  },
  bgmStartTime: {
    action: 'directive',
    category: 'bgm',
    label: '시작시간 설정',
    content: { icon: 'bgmStartTime', style: 'w-5 h-5' },
    position: 'attribute',
    key: 'startTime',
    value: '5',
  },
  codeLanguage: {
    action: 'code',
    category: 'code',
    label: '언어 설정',
    content: { icon: 'text', style: 'text-sm font-semibold', value: 'JS' },
    field: 'language',
  },
};

export function createProps(
  button: WritePostContentButton
): WritePostContentButtonProps {
  return buttonProps[button.id];
}
