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
  | 'bgmStartTime'
  | 'underline'
  | 'heading'
  | 'list'
  | 'more';

export interface ButtonContent {
  icon: ButtonIcon;
  style: string;
  value?: string;
}

export interface DropdownGroupProps {
  id: string;
  type: 'dropdown';
  label: string;
  content: ButtonContent;
  items: string[];
}

export interface MarkdownButtonProps {
  id: string;
  action: 'markdown';
  category: 'default';
  label: string;
  content: ButtonContent;
  isBlock: boolean;
  markdownBefore: string;
  markdownAfter?: string;
}

export interface TableButtonProps {
  id: string;
  action: 'table';
  category: 'table';
  label: string;
  content: ButtonContent;
  direction: 'row' | 'column';
}

export interface CodeButtonProps {
  id: string;
  action: 'code';
  category: 'code';
  label: string;
  content: ButtonContent;
  field: 'language';
}

export interface DirectiveButtonProps {
  id: string;
  action: 'directive';
  category: 'image' | 'bgm';
  label: string;
  content: ButtonContent;
  position: 'attribute' | 'content';
  key?: string;
  value: string;
}

export interface UploadButtonProps {
  id: string;
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

export const dropdownGroups: Record<string, DropdownGroupProps> = {
  heading: {
    id: 'heading',
    type: 'dropdown',
    label: '제목',
    content: { icon: 'heading', style: 'text-sm font-semibold' },
    items: ['heading1', 'heading2', 'heading3'],
  },
  list: {
    id: 'list',
    type: 'dropdown',
    label: '리스트',
    content: { icon: 'list', style: 'w-4 h-4' },
    items: ['unorderedList', 'orderedList'],
  },
  more: {
    id: 'more',
    type: 'dropdown',
    label: '더보기',
    content: { icon: 'more', style: 'w-4 h-4' },
    items: ['bgm', 'code', 'table', 'horizontalRule', 'blockquote'],
  },
};

export const buttonProps: Record<string, WritePostContentButtonProps> = {
  heading1: {
    id: 'heading1',
    action: 'markdown',
    category: 'default',
    label: '큰 제목',
    content: { icon: 'text', style: 'text-sm font-semibold', value: 'H1' },
    isBlock: true,
    markdownBefore: '# 제목',
  },
  heading2: {
    id: 'heading2',
    action: 'markdown',
    category: 'default',
    label: '중간 제목',
    content: { icon: 'text', style: 'text-xs font-semibold', value: 'H2' },
    isBlock: true,
    markdownBefore: '## 제목',
  },
  heading3: {
    id: 'heading3',
    action: 'markdown',
    category: 'default',
    label: '작은 제목',
    content: { icon: 'text', style: 'text-xs', value: 'H3' },
    isBlock: true,
    markdownBefore: '### 제목',
  },
  bold: {
    id: 'bold',
    action: 'markdown',
    category: 'default',
    label: '굵게 (Ctrl+B)',
    content: { icon: 'text', style: 'font-bold', value: 'B' },
    isBlock: false,
    markdownBefore: '**',
    markdownAfter: '**',
  },
  italic: {
    id: 'italic',
    action: 'markdown',
    category: 'default',
    label: '기울이기 (Ctrl+I)',
    content: { icon: 'text', style: 'italic', value: 'I' },
    isBlock: false,
    markdownBefore: '*',
    markdownAfter: '*',
  },
  underline: {
    id: 'underline',
    action: 'markdown',
    category: 'default',
    label: '밑줄 (Ctrl+U)',
    content: { icon: 'underline', style: 'w-4 h-4' },
    isBlock: false,
    markdownBefore: '++',
    markdownAfter: '++',
  },
  strikethrough: {
    id: 'strikethrough',
    action: 'markdown',
    category: 'default',
    label: '취소선 (Ctrl+Shift+S)',
    content: { icon: 'text', style: 'line-through', value: 'T' },
    isBlock: false,
    markdownBefore: '~~',
    markdownAfter: '~~',
  },
  link: {
    id: 'link',
    action: 'markdown',
    category: 'default',
    label: '링크 (Ctrl+K)',
    content: { icon: 'link', style: 'w-4 h-4' },
    isBlock: false,
    markdownBefore: '[링크',
    markdownAfter: '](url)',
  },
  code: {
    id: 'code',
    action: 'markdown',
    category: 'default',
    label: '코드 블록',
    content: { icon: 'code', style: 'w-4 h-4' },
    isBlock: true,
    markdownBefore: '```\n코드를 입력해주세요.',
    markdownAfter: '\n```',
  },
  table: {
    id: 'table',
    action: 'markdown',
    category: 'default',
    label: '표',
    content: { icon: 'table', style: 'w-4 h-4' },
    isBlock: true,
    markdownBefore: '| 제목1',
    markdownAfter: ' | 제목2 |\n|-------|-------|\n| 내용1 | 내용2 |',
  },
  addRow: {
    id: 'addRow',
    action: 'table',
    category: 'table',
    label: '행 추가하기',
    content: { icon: 'addRow', style: 'w-4 h-4' },
    direction: 'row',
  },
  addColumn: {
    id: 'addColumn',
    action: 'table',
    category: 'table',
    label: '열 추가하기',
    content: { icon: 'addColumn', style: 'w-4 h-4' },
    direction: 'column',
  },
  unorderedList: {
    id: 'unorderedList',
    action: 'markdown',
    category: 'default',
    label: '순서 없는 목록',
    content: { icon: 'text', style: 'text-xl', value: '•' },
    isBlock: true,
    markdownBefore: '- 항목 1',
    markdownAfter: '\n- 항목 2\n- 항목 3',
  },
  orderedList: {
    id: 'orderedList',
    action: 'markdown',
    category: 'default',
    label: '순서 있는 목록',
    content: { icon: 'text', style: 'text-sm font-bold', value: '1.' },
    isBlock: true,
    markdownBefore: '1. 항목 1',
    markdownAfter: '\n2. 항목 2\n3. 항목 3',
  },
  blockquote: {
    id: 'blockquote',
    action: 'markdown',
    category: 'default',
    label: '인용문',
    content: { icon: 'blockquote', style: 'w-4 h-4 fill-gray-900' },
    isBlock: true,
    markdownBefore: '> 내용',
  },
  horizontalRule: {
    id: 'horizontalRule',
    action: 'markdown',
    category: 'default',
    label: '구분선',
    content: { icon: 'horizontalRule', style: 'w-4 h-4' },
    isBlock: true,
    markdownBefore: '---',
  },
  image: {
    id: 'image',
    action: 'upload',
    category: 'default',
    label: '이미지',
    content: { icon: 'image', style: 'w-4 h-4' },
  },
  imageLarge: {
    id: 'imageLarge',
    action: 'directive',
    category: 'image',
    label: '이미지 크게',
    content: { icon: 'imageLarge', style: 'w-4 h-4' },
    position: 'attribute',
    key: 'size',
    value: 'large',
  },
  imageSmall: {
    id: 'imageSmall',
    action: 'directive',
    category: 'image',
    label: '이미지 작게',
    content: { icon: 'imageSmall', style: 'w-4 h-4' },
    position: 'attribute',
    key: 'size',
    value: 'medium',
  },
  imageCaption: {
    id: 'imageCaption',
    action: 'directive',
    category: 'image',
    label: '이미지 설명 추가',
    content: { icon: 'imageCaption', style: 'w-4 h-4' },
    position: 'content',
    value: '이미지를 설명해주세요.',
  },
  imageSubtitle: {
    id: 'imageSubtitle',
    action: 'directive',
    category: 'image',
    label: '이미지 자막 추가',
    content: { icon: 'imageSubtitle', style: 'w-5 h-5' },
    position: 'content',
    value: '#자막은 전체화면에서 한 문장씩 표시됩니다.',
  },
  bgm: {
    id: 'bgm',
    action: 'markdown',
    category: 'default',
    label: 'BGM',
    content: { icon: 'bgm', style: 'w-4 h-4' },
    isBlock: true,
    markdownBefore: '::bgm{youtubeUrl="',
    markdownAfter: '"}\n',
  },
  bgmStartTime: {
    id: 'bgmStartTime',
    action: 'directive',
    category: 'bgm',
    label: '시작시간 설정',
    content: { icon: 'bgmStartTime', style: 'w-5 h-5' },
    position: 'attribute',
    key: 'startTime',
    value: '5',
  },
  codeLanguage: {
    id: 'codeLanguage',
    action: 'code',
    category: 'code',
    label: '언어 설정',
    content: { icon: 'text', style: 'text-sm font-semibold', value: 'JS' },
    field: 'language',
  },
};
