'use client';

import Tooltip from '@/components/tooltip';
import EditorToolbarStyleDropdown from '@/components/write/editorToolbarStyleDropdown';
import LinkEditDialog from '@/components/write/linkEditDialog';
import { uploadBgm } from '@/features/media/utils/uploadBgm';
import { uploadImage } from '@/features/media/utils/uploadImage';
import { Editor, useEditorState } from '@tiptap/react';
import clsx from 'clsx';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  MessageSquare,
  Minus,
  Music,
  Quote,
  Strikethrough,
  Table,
  Text,
  Underline,
} from 'lucide-react';
import { useRef, useState } from 'react';

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive('bold') ?? false,
      isItalic: editor?.isActive('italic') ?? false,
      isUnderline: editor?.isActive('underline') ?? false,
      isStrike: editor?.isActive('strike') ?? false,
      isLink: editor?.isActive('link') ?? false,
      isText:
        editor !== null &&
        editor.isActive('paragraph') &&
        !editor.isActive('blockquote'),
      isHeading1: editor?.isActive('heading', { level: 1 }) ?? false,
      isHeading2: editor?.isActive('heading', { level: 2 }) ?? false,
      isHeading3: editor?.isActive('heading', { level: 3 }) ?? false,
      isBlockquote: editor?.isActive('blockquote') ?? false,
      isCodeBlock: editor?.isActive('codeBlock') ?? false,
    }),
  });

  const textStyles = [
    {
      label: '본문',
      icon: Text,
      action: () => editor?.chain().focus().setParagraph().run(),
      active: editorState?.isText ?? false,
    },
    {
      label: '큰 제목',
      icon: Heading1,
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editorState?.isHeading1 ?? false,
    },
    {
      label: '중간 제목',
      icon: Heading2,
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editorState?.isHeading2 ?? false,
    },
    {
      label: '작은 제목',
      icon: Heading3,
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editorState?.isHeading3 ?? false,
    },
    {
      label: '인용',
      icon: Quote,
      action: () => {
        if (editor?.isActive('heading') || editor?.isActive('codeBlock')) {
          editor?.chain().focus().setParagraph().toggleBlockquote().run();
        } else {
          editor?.chain().focus().toggleBlockquote().run();
        }
      },
      active: editorState?.isBlockquote ?? false,
    },
    {
      label: '코드',
      icon: Code,
      action: () => editor?.chain().focus().toggleCodeBlock().run(),
      active: editorState?.isCodeBlock ?? false,
    },
  ] as const;

  const textItems = [
    {
      key: '굵게',
      label: '굵게',
      icon: Bold,
      active: editorState?.isBold ?? false,
      onClick: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      key: '기울임',
      label: '기울임',
      icon: Italic,
      active: editorState?.isItalic ?? false,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      key: '밑줄',
      label: '밑줄',
      icon: Underline,
      active: editorState?.isUnderline ?? false,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
    },
    {
      key: '취소선',
      label: '취소선',
      icon: Strikethrough,
      active: editorState?.isStrike ?? false,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
    },
    {
      key: '링크',
      label: '링크',
      icon: Link,
      active: editorState?.isLink ?? false,
      onClick: () => setIsLinkDialogOpen(true),
    },
  ] as const;

  const blockItems = [
    {
      key: '사진',
      label: '사진',
      icon: Image,
      onClick: () => fileInputRef.current?.click(),
    },
    {
      key: 'BGM',
      label: 'BGM',
      icon: Music,
      onClick: () => audioInputRef.current?.click(),
    },
    {
      key: '목록',
      label: '목록',
      icon: List,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      key: '표',
      label: '표',
      icon: Table,
      onClick: () =>
        editor
          ?.chain()
          .focus()
          .insertTable({ rows: 2, cols: 2, withHeaderRow: true })
          .run(),
    },
    {
      key: '구분선',
      label: '구분선',
      icon: Minus,
      onClick: () => editor?.chain().focus().setHorizontalRule().run(),
    },
    {
      key: '대사',
      label: '대사',
      icon: MessageSquare,
      onClick: () =>
        editor?.chain().focus().setDialogue({ speaker: '화자' }).run(),
    },
  ] as const;

  const handleLinkInsert = (url: string) => {
    if (!editor) return;

    const { from, to } = editor.state.selection;

    if (from === to) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: url,
          marks: [{ type: 'link', attrs: { href: url } }],
        })
        .run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) return null;

  return (
    <div
      className={clsx(
        'sticky top-(--toolbar-height) z-40 w-full mb-10',
        'p-1 gap-1 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-md'
      )}
    >
      <div className='w-full flex px-2 py-1 gap-1 overflow-x-auto scrollbar-hide border-gray-200'>
        <EditorToolbarStyleDropdown
          styles={textStyles}
          onSelect={label => {
            textStyles.find(style => style.label === label)?.action();
          }}
        />

        <div className='w-px h-6 bg-gray-200 mx-1 shrink-0' />

        {textItems.map(item => (
          <Tooltip key={item.key} text={item.label} direction='top'>
            <button
              type='button'
              onClick={item.onClick}
              className={clsx(
                'w-8 h-8 flex items-center justify-center shrink-0 p-2 rounded hover:bg-gray-100 cursor-pointer',
                item.active && 'bg-gray-100'
              )}
            >
              <item.icon className='w-4 h-4 text-gray-700' />
            </button>
          </Tooltip>
        ))}

        <div className='w-px h-6 bg-gray-200 mx-1 shrink-0' />

        {blockItems.map(item => (
          <Tooltip key={item.key} text={item.label} direction='top'>
            <button
              type='button'
              onClick={item.onClick}
              className='w-8 h-8 flex items-center justify-center shrink-0 p-2 rounded hover:bg-gray-100 cursor-pointer'
            >
              <item.icon className='w-4 h-4 text-gray-700' />
            </button>
          </Tooltip>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={e => {
          const files = e.target.files;
          if (files && files.length > 0 && editor) {
            uploadImage(editor, Array.from(files));
          }
          e.target.value = '';
        }}
        className='hidden'
      />

      <input
        ref={audioInputRef}
        type='file'
        accept='audio/mpeg'
        onChange={async e => {
          const file = e.target.files?.[0];
          if (file && editor) {
            await uploadBgm(editor, file);
          }
          e.target.value = '';
        }}
        className='hidden'
      />

      <LinkEditDialog
        isOpen={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        onSave={handleLinkInsert}
        title='링크 추가'
      />
    </div>
  );
}
