'use client';

import BgmNode from '@/components/tiptap/nodes/bgm/bgmNode';
import DialogueNode from '@/components/tiptap/nodes/dialogue/dialogueNode';
import ImageWithCaptionNode from '@/components/tiptap/nodes/imageWithCaption/imageWithCaptionNode';
import TiptapToolbar from '@/components/tiptap/tiptapToolbar';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TiptapEditorProps {
  initialContent?: JSONContent;
  onSave?: (json: JSONContent) => void;
}

export default function TiptapEditor({ initialContent, onSave }: TiptapEditorProps) {
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
        class:
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-full p-4',
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
      <TiptapToolbar editor={editor} />
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
