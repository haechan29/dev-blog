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
import { TocAnchor } from '@/components/write/tableOfContents';
import CharacterCount from '@tiptap/extension-character-count';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { TableOfContents } from '@tiptap/extension-table-of-contents';
import TableRow from '@tiptap/extension-table-row';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface TiptapEditorRef {
  getJSON: () => JSONContent | undefined;
  isEmpty: () => boolean;
}

const TiptapEditor = forwardRef<
  TiptapEditorRef,
  {
    initialContent?: JSONContent;
    onAnchorsChange?: (anchors: TocAnchor[]) => void;
    className?: string;
  }
>(function TiptapEditor({ initialContent, onAnchorsChange, className }, ref) {
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
      CharacterCount.configure({
        limit: 30000,
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
      TableOfContents.configure({
        onUpdate: anchors => {
          if (onAnchorsChange) {
            onAnchorsChange(anchors as TocAnchor[]);
          }
        },
      }),
    ],
    content: initialContent ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: clsx(
          'prose max-w-none focus:outline-none min-h-[30vh]',
          className
        ),
      },
    },
  });

  useImperativeHandle(ref, () => ({
    getJSON: () => editor?.getJSON(),
    isEmpty: () => editor?.isEmpty ?? true,
  }));

  return (
    <div className='h-full flex flex-col'>
      <DialogueToolbar
        editor={editor}
        isOpen={isDialogueToolbarOpen}
        setIsOpen={setIsDialogueToolbarOpen}
      />
      <div className='min-h-[30vh] relative'>
        {(!editor || editor.isEmpty) && (
          <div className='prose max-w-none text-gray-400! absolute'>
            여기에 글을 작성하세요
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
      <PlusMenu editor={editor} />
      <FloatingMenu editor={editor} />
      <LinkPasteMenu editor={editor} />
      <TableMenu editor={editor} />
    </div>
  );
});

export default TiptapEditor;
