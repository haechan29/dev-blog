'use client';

import { Editor } from '@tiptap/react';

interface TiptapToolbarProps {
  editor: Editor | null;
}

export default function TiptapToolbar({ editor }: TiptapToolbarProps) {
  if (!editor) return null;

  const buttonClass = (isActive: boolean) =>
    `px-2 py-1 rounded text-sm ${
      isActive ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
    }`;

  const addLink = () => {
    const url = window.prompt('URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addDialogue = () => {
    const speaker = window.prompt('화자명을 입력하세요:');
    if (speaker) {
      editor.chain().focus().setDialogue({ speaker }).run();
    }
  };

  return (
    <div className='flex flex-wrap gap-1 p-2 border-b bg-gray-50'>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive('underline'))}
      >
        U
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'))}
      >
        S
      </button>
      <button
        onClick={addLink}
        className={buttonClass(editor.isActive('link'))}
      >
        🔗
      </button>

      <div className='w-px bg-gray-300 mx-1' />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 3 }))}
      >
        H3
      </button>

      <div className='w-px bg-gray-300 mx-1' />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
      >
        • 목록
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
      >
        1. 목록
      </button>

      <div className='w-px bg-gray-300 mx-1' />

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive('blockquote'))}
      >
        인용
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive('codeBlock'))}
      >
        코드
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass(false)}
      >
        ─
      </button>

      <div className='w-px bg-gray-300 mx-1' />

      <button
        onClick={() => {
          const url = window.prompt('이미지 URL을 입력하세요:');
          if (url) {
            editor.chain().focus().setImageWithCaption({ src: url }).run();
          }
        }}
        className={buttonClass(false)}
      >
        🖼️
      </button>

      <button
        onClick={addDialogue}
        className={buttonClass(editor.isActive('dialogue'))}
      >
        💬
      </button>

      <button
        onClick={() => {
          const src = window.prompt('BGM 소스 URL을 입력하세요:');
          if (src) {
            editor.chain().focus().setBgm({ src }).run();
          }
        }}
        className={buttonClass(editor.isActive('bgm'))}
      >
        🎵
      </button>
    </div>
  );
}
