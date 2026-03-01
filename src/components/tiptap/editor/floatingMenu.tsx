'use client';

import LinkEditDialog from '@/components/write/linkEditDialog';
import { Editor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import clsx from 'clsx';
import {
  Bold,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  Quote,
  Strikethrough,
  Text,
  Underline,
} from 'lucide-react';
import { useState } from 'react';

export default function FloatingMenu({ editor }: { editor: Editor | null }) {
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
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

  if (!editor) return null;

  const styleOptions = [
    {
      label: '본문',
      icon: Text,
      action: () => editor.chain().focus().setParagraph().run(),
      active: editorState?.isText ?? false,
    },
    {
      label: '큰 제목',
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editorState?.isHeading1 ?? false,
    },
    {
      label: '중간 제목',
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editorState?.isHeading2 ?? false,
    },
    {
      label: '작은 제목',
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editorState?.isHeading3 ?? false,
    },
    {
      label: '인용',
      icon: Quote,
      action: () => {
        if (editor.isActive('heading') || editor.isActive('codeBlock')) {
          editor.chain().focus().setParagraph().toggleBlockquote().run();
        } else {
          editor.chain().focus().toggleBlockquote().run();
        }
      },
      active: editorState?.isBlockquote ?? false,
    },
    {
      label: '코드',
      icon: Code,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editorState?.isCodeBlock ?? false,
    },
  ];

  const currentStyle = styleOptions.find(opt => opt.active) ?? styleOptions[0];

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

  return (
    <>
      <BubbleMenu
        editor={editor}
        pluginKey='floatingToolbar'
        options={{
          placement: 'top',
          onHide: () => setShowStyleDropdown(false),
        }}
        shouldShow={({ editor }) => {
          const { selection } = editor.state;
          const { empty } = selection;

          if (!empty) return true;

          const { $from } = selection;
          const isEmptyLine = $from.parent.content.size === 0;
          return isEmptyLine;
        }}
      >
        <div className='bg-white shadow-lg rounded-lg border border-gray-200 flex items-center gap-1 p-1'>
          {/* 단락 스타일 드롭다운 */}
          <div className='relative'>
            <button
              onClick={() => setShowStyleDropdown(!showStyleDropdown)}
              className='px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-1.5 text-sm'
            >
              <currentStyle.icon size={16} />
              {currentStyle.label}
              <ChevronDown size={14} />
            </button>
            {showStyleDropdown && (
              <div className='absolute top-full left-0 mt-1 bg-popover shadow-md rounded-md border p-1 min-w-32 z-10'>
                {styleOptions.map(option => (
                  <button
                    key={option.label}
                    onClick={() => {
                      option.action();
                      setShowStyleDropdown(false);
                    }}
                    className={clsx(
                      'w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center gap-2',
                      'hover:bg-accent hover:text-accent-foreground',
                      option.active && 'bg-accent font-medium'
                    )}
                  >
                    <option.icon size={16} />
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 구분선 */}
          <div className='w-px h-6 bg-gray-300 mx-1' />

          {/* 인라인 서식 버튼 */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={clsx(
              'p-1.5 rounded hover:bg-gray-100',
              editorState?.isBold && 'bg-gray-200'
            )}
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={clsx(
              'p-1.5 rounded hover:bg-gray-100',
              editorState?.isItalic && 'bg-gray-200'
            )}
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={clsx(
              'p-1.5 rounded hover:bg-gray-100',
              editorState?.isUnderline && 'bg-gray-200'
            )}
          >
            <Underline size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={clsx(
              'p-1.5 rounded hover:bg-gray-100',
              editorState?.isStrike && 'bg-gray-200'
            )}
          >
            <Strikethrough size={16} />
          </button>
          <button
            onClick={() => setIsLinkDialogOpen(true)}
            className={clsx(
              'p-1.5 rounded hover:bg-gray-100',
              editorState?.isLink && 'bg-gray-200'
            )}
          >
            <Link size={16} />
          </button>
        </div>
      </BubbleMenu>

      <LinkEditDialog
        isOpen={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        onSave={handleLinkInsert}
        title='링크 추가'
      />
    </>
  );
}
