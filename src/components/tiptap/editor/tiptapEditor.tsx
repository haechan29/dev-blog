'use client';

import DialogueToolbar from '@/components/tiptap/editor/dialogueToolbar';
import FloatingMenu from '@/components/tiptap/editor/floatingMenu';
import LinkPasteMenu from '@/components/tiptap/editor/linkPasteMenu';
import PlusMenu from '@/components/tiptap/editor/plusMenu';
import TableMenu from '@/components/tiptap/editor/tableMenu';
import BgmNode from '@/components/tiptap/nodes/bgm';
import BlockQuoteNode from '@/components/tiptap/nodes/blockQuote';
import CodeBlockNode from '@/components/tiptap/nodes/codeBlock';
import DialogueNode from '@/components/tiptap/nodes/dialogue';
import ImageWithCaptionNode from '@/components/tiptap/nodes/imageWithCaption';
import LinkNode from '@/components/tiptap/nodes/link';
import LinkCardNode from '@/components/tiptap/nodes/linkCard';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
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
        codeBlock: false,
        link: false,
        blockquote: false,
      }),
      CodeBlockNode,
      LinkNode,
      BlockQuoteNode,
      ImageWithCaptionNode,
      DialogueNode,
      BgmNode,
      LinkCardNode,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
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
    <div className='h-full flex flex-col'>
      <DialogueToolbar
        editor={editor}
        isOpen={isDialogueToolbarOpen}
        setIsOpen={setIsDialogueToolbarOpen}
      />
      <EditorContent editor={editor} className='h-full' />
      <PlusMenu editor={editor} />
      <FloatingMenu editor={editor} />
      <LinkPasteMenu editor={editor} />
      <TableMenu editor={editor} />
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
