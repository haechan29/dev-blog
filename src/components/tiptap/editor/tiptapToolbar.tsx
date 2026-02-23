'use client';

import useTiptapBgmUpload from '@/features/media/hooks/useTiptapBgmUpload';
import useTiptapImageUpload from '@/features/media/hooks/useTiptapImageUpload';
import { Editor } from '@tiptap/react';
import { useRef } from 'react';

export default function TiptapToolbar({
  editor,
  onDialogueAdd,
}: {
  editor: Editor | null;
  onDialogueAdd: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage } = useTiptapImageUpload(editor);
  const { uploadBgm } = useTiptapBgmUpload(editor);

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

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={e => {
          const files = e.target.files;
          if (files && files.length > 0) {
            uploadImage(Array.from(files));
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
          if (file) {
            await uploadBgm(file);
          }
          e.target.value = '';
        }}
        className='hidden'
      />

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
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={buttonClass(editor.isActive('heading', { level: 1 }))}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(editor.isActive('heading', { level: 2 }))}
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
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
          onClick={() => fileInputRef.current?.click()}
          className={buttonClass(false)}
        >
          🖼️
        </button>

        <button
          onClick={() => {
            editor.chain().focus().setDialogue({ speaker: '화자 1' }).run();
            onDialogueAdd();
          }}
          className={buttonClass(editor.isActive('dialogue'))}
        >
          💬
        </button>

        <button
          onClick={() => audioInputRef.current?.click()}
          className={buttonClass(editor.isActive('bgm'))}
        >
          🎵
        </button>
      </div>
    </>
  );
}
