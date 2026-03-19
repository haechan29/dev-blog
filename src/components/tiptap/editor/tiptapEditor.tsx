'use client';

import TableOfContents from '@/components/post/tableOfContents';
import BlockMenu from '@/components/tiptap/editor/blockMenu';
import DialogueToolbar from '@/components/tiptap/editor/dialogueToolbar';
import FloatingMenu from '@/components/tiptap/editor/floatingMenu';
import LinkPasteMenu from '@/components/tiptap/editor/linkPasteMenu';
import TableMenu from '@/components/tiptap/editor/tableMenu';
import BgmView from '@/components/tiptap/editor/views/bgm';
import CodeBlockView from '@/components/tiptap/editor/views/codeBlock';
import DialogueView from '@/components/tiptap/editor/views/dialogue';
import HorizontalRuleView from '@/components/tiptap/editor/views/horizontalRule';
import ImageWithCaptionView from '@/components/tiptap/editor/views/imageWithCaption';
import LinkCardView from '@/components/tiptap/editor/views/linkCard';
import BgmNode from '@/components/tiptap/nodes/bgm';
import DialogueNode from '@/components/tiptap/nodes/dialogue';
import ImageWithCaptionNode from '@/components/tiptap/nodes/imageWithCaption';
import LinkCardNode from '@/components/tiptap/nodes/linkCard';
import EditorToolbar from '@/components/write/editorToolbar';
import { uploadImage } from '@/features/media/utils/uploadImage';
import Heading from '@/features/post/domain/types/heading';
import TocAnchor from '@/features/post/domain/types/tocAnchor';
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
import { TableOfContents as TableOfContentsExtension } from '@tiptap/extension-table-of-contents';
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
    className?: string;
  }
>(function TiptapEditor({ initialContent, className }, ref) {
  const [anchors, setAnchors] = useState<TocAnchor[]>([]);
  const [isEditorToolbarVisible, setIsEditorToolbarVisible] = useState(false);
  const [isDialogueToolbarOpen, setIsDialogueToolbarOpen] = useState(false);

  const handleTocItemClick = (heading: Heading) => {
    const anchor = anchors.find(a => a.id === heading.id);
    anchor?.dom.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

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
      TableOfContentsExtension.configure({
        onUpdate: setAnchors,
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
    onFocus: () => {
      setIsEditorToolbarVisible(true);
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
    <>
      <EditorToolbar
        editor={editor}
        isVisible={isEditorToolbarVisible}
        onClose={() => setIsEditorToolbarVisible(false)}
      />

      <div className='mb-10 xl:mb-0'>
        <div className='block xl:hidden text-xl xl:text-2xl font-bold text-gray-900 mt-4 mb-2 leading-tight'>
          목차
        </div>
        <TableOfContents
          headings={anchors}
          currentHeadingId={anchors.find(a => a.isActive)?.id ?? null}
          onItemClick={handleTocItemClick}
          showPlaceholder
        />
      </div>

      <div className='min-h-[30vh] relative'>
        <EditorContent editor={editor} />
      </div>

      <DialogueToolbar
        editor={editor}
        isOpen={isDialogueToolbarOpen}
        setIsOpen={setIsDialogueToolbarOpen}
      />
      <BlockMenu editor={editor} />
      <FloatingMenu editor={editor} />
      <LinkPasteMenu editor={editor} />
      <TableMenu editor={editor} />
    </>
  );
});

export default TiptapEditor;
