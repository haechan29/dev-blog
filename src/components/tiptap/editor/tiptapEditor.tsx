'use client';

import DialogueToolbar from '@/components/tiptap/editor/dialogueToolbar';
import FloatingMenu from '@/components/tiptap/editor/floatingMenu';
import LinkPasteMenu from '@/components/tiptap/editor/linkPasteMenu';
import PlusMenu from '@/components/tiptap/editor/plusMenu';
import TableMenu from '@/components/tiptap/editor/tableMenu';
import BgmView from '@/components/tiptap/editor/views/bgm';
import CodeBlockView from '@/components/tiptap/editor/views/codeBlock';
import DialogueView from '@/components/tiptap/editor/views/dialogue';
import ImageWithCaptionView from '@/components/tiptap/editor/views/imageWithCaption';
import LinkCardView from '@/components/tiptap/editor/views/linkCard';
import BgmNode from '@/components/tiptap/nodes/bgm';
import DialogueNode from '@/components/tiptap/nodes/dialogue';
import ImageWithCaptionNode from '@/components/tiptap/nodes/imageWithCaption';
import LinkCardNode from '@/components/tiptap/nodes/linkCard';
import { TocAnchor } from '@/components/write/tableOfContents';
import { Blockquote } from '@tiptap/extension-blockquote';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { TableOfContents } from '@tiptap/extension-table-of-contents';
import TableRow from '@tiptap/extension-table-row';
import {
  EditorContent,
  JSONContent,
  ReactNodeViewRenderer,
  useEditor,
} from '@tiptap/react';
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
        blockquote: false,
        codeBlock: false,
        link: false,
      }),
      CharacterCount.configure({
        limit: 30000,
      }),
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
      Blockquote.extend({
        content: '(paragraph | imageWithCaption)*',
      }),
      CodeBlock.configure({
        enableTabIndentation: true,
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockView);
        },
      }),
      Link.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            isNewlyInserted: {
              default: true,
            },
          };
        },
      }),
      LinkCardNode.extend({
        addNodeView() {
          return ReactNodeViewRenderer(LinkCardView);
        },
      }),
      ImageWithCaptionNode.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageWithCaptionView);
        },
      }),
      DialogueNode.extend({
        addNodeView() {
          return ReactNodeViewRenderer(DialogueView);
        },
      }),
      BgmNode.extend({
        addNodeView() {
          return ReactNodeViewRenderer(BgmView, {
            className: 'flex justify-end',
          });
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
