import type { LucideIcon } from 'lucide-react';
import {
  AlignCenter,
  Code2,
  Columns,
  Expand,
  Grid2x2,
  ImageIcon,
  Link,
  List,
  Minus,
  MoreHorizontal,
  Music,
  Quote,
  Rows,
  Shrink,
  Underline,
  Users,
} from 'lucide-react';

interface IconButtonContent {
  type: 'icon';
  icon: LucideIcon;
  style: string;
}

interface TextButtonContent {
  type: 'text';
  value: string;
  style: string;
}

export type ButtonContent = IconButtonContent | TextButtonContent;

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
  category: 'image';
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
  type: 'image' | 'audio';
}

export interface ToggleButtonProps {
  id: string;
  action: 'toggle';
  category: 'default';
  label: string;
  content: ButtonContent;
  target: 'speakerPanel';
}

export type WritePostContentButtonProps =
  | MarkdownButtonProps
  | TableButtonProps
  | CodeButtonProps
  | DirectiveButtonProps
  | UploadButtonProps
  | ToggleButtonProps;

export type ButtonAction = WritePostContentButtonProps['action'];
export type ButtonCategory = WritePostContentButtonProps['category'];

export const dropdownGroups: Record<string, DropdownGroupProps> = {
  heading: {
    id: 'heading',
    type: 'dropdown',
    label: '제목',
    content: { type: 'text', value: 'H', style: 'text-sm font-semibold' },
    items: ['heading1', 'heading2', 'heading3'],
  },
  list: {
    id: 'list',
    type: 'dropdown',
    label: '리스트',
    content: { type: 'icon', icon: List, style: 'w-4 h-4' },
    items: ['unorderedList', 'orderedList'],
  },
  more: {
    id: 'more',
    type: 'dropdown',
    label: '더보기',
    content: { type: 'icon', icon: MoreHorizontal, style: 'w-4 h-4' },
    items: [
      'bgm',
      'speakerPanel',
      'code',
      'table',
      'horizontalRule',
      'blockquote',
    ],
  },
};

export const buttonProps: Record<string, WritePostContentButtonProps> = {
  heading1: {
    id: 'heading1',
    action: 'markdown',
    category: 'default',
    label: '큰 제목',
    content: { type: 'text', value: 'H1', style: 'text-sm font-semibold' },
    isBlock: true,
    markdownBefore: '# 제목',
  },
  heading2: {
    id: 'heading2',
    action: 'markdown',
    category: 'default',
    label: '중간 제목',
    content: { type: 'text', value: 'H2', style: 'text-xs font-semibold' },
    isBlock: true,
    markdownBefore: '## 제목',
  },
  heading3: {
    id: 'heading3',
    action: 'markdown',
    category: 'default',
    label: '작은 제목',
    content: { type: 'text', value: 'H3', style: 'text-xs' },
    isBlock: true,
    markdownBefore: '### 제목',
  },
  bold: {
    id: 'bold',
    action: 'markdown',
    category: 'default',
    label: '굵게 (Ctrl+B)',
    content: { type: 'text', value: 'B', style: 'font-bold' },
    isBlock: false,
    markdownBefore: '**',
    markdownAfter: '**',
  },
  italic: {
    id: 'italic',
    action: 'markdown',
    category: 'default',
    label: '기울이기 (Ctrl+I)',
    content: { type: 'text', value: 'I', style: 'italic' },
    isBlock: false,
    markdownBefore: '*',
    markdownAfter: '*',
  },
  underline: {
    id: 'underline',
    action: 'markdown',
    category: 'default',
    label: '밑줄 (Ctrl+U)',
    content: { type: 'icon', icon: Underline, style: 'w-4 h-4' },
    isBlock: false,
    markdownBefore: '++',
    markdownAfter: '++',
  },
  strikethrough: {
    id: 'strikethrough',
    action: 'markdown',
    category: 'default',
    label: '취소선 (Ctrl+Shift+S)',
    content: { type: 'text', value: 'T', style: 'line-through' },
    isBlock: false,
    markdownBefore: '~~',
    markdownAfter: '~~',
  },
  link: {
    id: 'link',
    action: 'markdown',
    category: 'default',
    label: '링크 (Ctrl+K)',
    content: { type: 'icon', icon: Link, style: 'w-4 h-4' },
    isBlock: false,
    markdownBefore: '[링크',
    markdownAfter: '](url)',
  },
  code: {
    id: 'code',
    action: 'markdown',
    category: 'default',
    label: '코드 블록',
    content: { type: 'icon', icon: Code2, style: 'w-4 h-4' },
    isBlock: true,
    markdownBefore: '```\n코드를 입력해주세요.',
    markdownAfter: '\n```',
  },
  table: {
    id: 'table',
    action: 'markdown',
    category: 'default',
    label: '표',
    content: { type: 'icon', icon: Grid2x2, style: 'w-4 h-4' },

    isBlock: true,
    markdownBefore: '| 제목1',
    markdownAfter: ' | 제목2 |\n|-------|-------|\n| 내용1 | 내용2 |',
  },
  addRow: {
    id: 'addRow',
    action: 'table',
    category: 'table',
    label: '행 추가하기',
    content: { type: 'icon', icon: Rows, style: 'w-4 h-4' },
    direction: 'row',
  },
  addColumn: {
    id: 'addColumn',
    action: 'table',
    category: 'table',
    label: '열 추가하기',
    content: { type: 'icon', icon: Columns, style: 'w-4 h-4' },
    direction: 'column',
  },
  unorderedList: {
    id: 'unorderedList',
    action: 'markdown',
    category: 'default',
    label: '순서 없는 목록',
    content: { type: 'text', value: '•', style: 'text-xl' },
    isBlock: true,
    markdownBefore: '- 항목 1',
    markdownAfter: '\n- 항목 2\n- 항목 3',
  },
  orderedList: {
    id: 'orderedList',
    action: 'markdown',
    category: 'default',
    label: '순서 있는 목록',
    content: { type: 'text', value: '1.', style: 'text-sm font-bold' },
    isBlock: true,
    markdownBefore: '1. 항목 1',
    markdownAfter: '\n2. 항목 2\n3. 항목 3',
  },
  blockquote: {
    id: 'blockquote',
    action: 'markdown',
    category: 'default',
    label: '인용문',
    content: { type: 'icon', icon: Quote, style: 'w-4 h-4 fill-gray-900' },
    isBlock: true,
    markdownBefore: '> 내용',
  },
  horizontalRule: {
    id: 'horizontalRule',
    action: 'markdown',
    category: 'default',
    label: '구분선',
    content: { type: 'icon', icon: Minus, style: 'w-4 h-4' },
    isBlock: true,
    markdownBefore: '---',
  },
  image: {
    id: 'image',
    action: 'upload',
    category: 'default',
    label: '이미지',
    content: { type: 'icon', icon: ImageIcon, style: 'w-4 h-4' },
    type: 'image',
  },
  imageLarge: {
    id: 'imageLarge',
    action: 'directive',
    category: 'image',
    label: '이미지 크게',
    content: { type: 'icon', icon: Expand, style: 'w-4 h-4' },
    position: 'attribute',
    key: 'size',
    value: 'large',
  },
  imageSmall: {
    id: 'imageSmall',
    action: 'directive',
    category: 'image',
    label: '이미지 작게',
    content: { type: 'icon', icon: Shrink, style: 'w-4 h-4' },
    position: 'attribute',
    key: 'size',
    value: 'medium',
  },
  imageCaption: {
    id: 'imageCaption',
    action: 'directive',
    category: 'image',
    label: '이미지 설명 추가',
    content: { type: 'icon', icon: AlignCenter, style: 'w-4 h-4' },
    position: 'content',
    value: '이미지를 설명해주세요.',
  },
  bgm: {
    id: 'bgm',
    action: 'upload',
    category: 'default',
    label: 'BGM',
    content: { type: 'icon', icon: Music, style: 'w-4 h-4' },
    type: 'audio',
  },
  codeLanguage: {
    id: 'codeLanguage',
    action: 'code',
    category: 'code',
    label: '언어 설정',
    content: { type: 'text', value: 'JS', style: 'text-sm font-semibold' },
    field: 'language',
  },
  speakerPanel: {
    id: 'speakerPanel',
    action: 'toggle',
    category: 'default',
    label: '화자 설정',
    content: { type: 'icon', icon: Users, style: 'w-4 h-4' },
    target: 'speakerPanel',
  },
};
