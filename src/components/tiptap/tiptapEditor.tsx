'use client';

import DialogueNode from '@/components/tiptap/nodes/dialogue/dialogueNode';
import ImageWithCaptionNode from '@/components/tiptap/nodes/imageWithCaption/imageWithCaptionNode';
import TiptapToolbar from '@/components/tiptap/tiptapToolbar';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function TiptapEditor() {
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
    ],
    content: '<p>여기에 글을 작성하세요...</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-full p-4',
      },
    },
  });

  return (
    <div className='h-full flex flex-col border rounded-lg overflow-hidden'>
      <TiptapToolbar editor={editor} />
      <div className='flex-1 overflow-y-auto'>
        <EditorContent editor={editor} className='h-full' />
      </div>
    </div>
  );
}
