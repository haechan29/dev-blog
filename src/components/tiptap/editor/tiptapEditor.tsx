'use client';

import DialogueToolbar from '@/components/tiptap/editor/dialogueToolbar';
import TiptapToolbar from '@/components/tiptap/editor/tiptapToolbar';
import BgmNode from '@/components/tiptap/nodes/bgm';
import DialogueNode from '@/components/tiptap/nodes/dialogue';
import ImageWithCaptionNode from '@/components/tiptap/nodes/imageWithCaption';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';

export default function TiptapEditor({
  initialContent,
  onSave,
}: {
  initialContent?: JSONContent;
  onSave?: (json: JSONContent) => void;
}) {
  const [isDialogueToolbarOpen, setIsDialogueToolbarOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      ImageWithCaptionNode,
      DialogueNode,
      BgmNode,
    ],
    content: initialContent ?? '<p>여기에 글을 작성하세요...</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-full p-4',
      },
    },
  });

  const handleSave = () => {
    if (editor && onSave) {
      onSave(editor.getJSON());
    }
  };

  return (
    <div className='h-full flex flex-col border rounded-lg overflow-hidden'>
      <TiptapToolbar
        editor={editor}
        onDialogueAdd={() => setIsDialogueToolbarOpen(true)}
      />
      <DialogueToolbar
        editor={editor}
        isOpen={isDialogueToolbarOpen}
        setIsOpen={setIsDialogueToolbarOpen}
      />
      <div className='flex-1 overflow-y-auto'>
        <EditorContent editor={editor} className='h-full' />
      </div>
      {onSave && (
        <div className='p-2 border-t'>
          <button
            onClick={handleSave}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
}
