'use client';

import BlockMenu from '@/components/tiptap/editor/blockMenu';
import DialogueToolbar from '@/components/tiptap/editor/dialogueToolbar';
import FloatingMenu from '@/components/tiptap/editor/floatingMenu';
import LinkPasteMenu from '@/components/tiptap/editor/linkPasteMenu';
import TableMenu from '@/components/tiptap/editor/tableMenu';
import CodeBlockView from '@/components/tiptap/editor/views/codeBlock';
import HorizontalRuleView from '@/components/tiptap/editor/views/horizontalRule';
import BgmNode from '@/components/tiptap/nodes/bgm';
import DialogueNode from '@/components/tiptap/nodes/dialogue';
import ImageWithCaptionNode from '@/components/tiptap/nodes/imageWithCaption';
import LinkCardNode from '@/components/tiptap/nodes/linkCard';
import { TocAnchor } from '@/components/write/tableOfContents';
import { uploadImage } from '@/features/media/utils/uploadImage';
import { Blockquote } from '@tiptap/extension-blockquote';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlock from '@tiptap/extension-code-block';
import { FileHandler } from '@tiptap/extension-file-handler';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
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
  setContent: (content: JSONContent | null) => void;
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
        horizontalRule: false,
        dropcursor: {
          color: '#6B9FED',
          width: 2,
        },
      }),
      CharacterCount.configure({
        limit: 30000,
      }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
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
      HorizontalRule.extend({
        addNodeView() {
          return ReactNodeViewRenderer(HorizontalRuleView);
        },
      }),
      LinkCardNode,
      ImageWithCaptionNode,
      DialogueNode,
      BgmNode,
      FileHandler.configure({
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ],
        onPaste: uploadImage,
        onDrop: uploadImage,
      }),
      Placeholder.configure({
        placeholder: '여기에 글을 작성하세요',
      }),
    ],
    content: initialContent ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: clsx('prose max-w-none focus:outline-none', className),
      },
    },
  });

  useImperativeHandle(ref, () => ({
    getJSON: () => editor?.getJSON(),
    isEmpty: () => editor?.isEmpty ?? true,
    setContent: content => {
      editor?.commands.setContent(content ?? '');
    },
  }));

  return (
    <div className='h-full flex flex-col'>
      <DialogueToolbar
        editor={editor}
        isOpen={isDialogueToolbarOpen}
        setIsOpen={setIsDialogueToolbarOpen}
      />
      <div className='min-h-[30vh] relative'>
        <EditorContent editor={editor} />
      </div>
      <BlockMenu editor={editor} />
      <FloatingMenu editor={editor} />
      <LinkPasteMenu editor={editor} />
      <TableMenu editor={editor} />
    </div>
  );
});

export default TiptapEditor;
