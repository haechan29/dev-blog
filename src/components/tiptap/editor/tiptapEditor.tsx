'use client';

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
import { TocAnchor } from '@/components/write/tableOfContents';
import { uploadImage } from '@/features/media/utils/uploadImage';
import { Blockquote } from '@tiptap/extension-blockquote';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlock from '@tiptap/extension-code-block';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { FileHandler } from '@tiptap/extension-file-handler';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { TableOfContents } from '@tiptap/extension-table-of-contents';
import TableRow from '@tiptap/extension-table-row';
import { Node as TipTapNode } from '@tiptap/pm/model';
import {
  EditorContent,
  JSONContent,
  ReactNodeViewRenderer,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { GripVertical, Trash2 } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

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
  const [isDragMenuOpen, setIsDragMenuOpen] = useState(false);

  const dragMenuRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<{ node: TipTapNode; pos: number } | null>(null);

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
  });

  useImperativeHandle(ref, () => ({
    getJSON: () => editor?.getJSON(),
    isEmpty: () => editor?.isEmpty ?? true,
  }));

  useEffect(() => {
    if (!isDragMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dragMenuRef.current &&
        !dragMenuRef.current.contains(e.target as Node)
      ) {
        setIsDragMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDragMenuOpen]);

  return (
    <div className='h-full flex flex-col'>
      <DialogueToolbar
        editor={editor}
        isOpen={isDialogueToolbarOpen}
        setIsOpen={setIsDialogueToolbarOpen}
      />
      <div className='min-h-[30vh] relative'>
        {editor && (
          <DragHandle
            editor={editor}
            onNodeChange={({ node, pos }) => {
              currentNodeRef.current = node ? { node, pos } : null;
            }}
          >
            <div ref={dragMenuRef} className='relative'>
              <button
                className={clsx(
                  'w-6 h-6 flex items-center justify-center cursor-grab hover:bg-gray-100 rounded',
                  isDragMenuOpen && 'bg-gray-100'
                )}
                onClick={() => {
                  setIsDragMenuOpen(!isDragMenuOpen);
                }}
              >
                <GripVertical className='w-4 h-4 text-gray-400' />
              </button>

              {isDragMenuOpen && (
                <div className='absolute left-0 top-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border p-1 min-w-32 z-50'>
                  <button
                    className='w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer'
                    onClick={() => {
                      if (currentNodeRef.current) {
                        const { pos, node } = currentNodeRef.current;
                        editor
                          .chain()
                          .focus()
                          .deleteRange({
                            from: pos,
                            to: pos + node.nodeSize,
                          })
                          .run();
                      }
                      setIsDragMenuOpen(false);
                    }}
                  >
                    <Trash2 className='w-4 h-4 text-gray-500' />
                    <div className='shrink-0 text-gray-900'>삭제</div>
                  </button>
                </div>
              )}
            </div>
          </DragHandle>
        )}
        <EditorContent editor={editor} />
      </div>
      {/* <PlusMenu editor={editor} /> */}
      <FloatingMenu editor={editor} />
      <LinkPasteMenu editor={editor} />
      <TableMenu editor={editor} />
    </div>
  );
});

export default TiptapEditor;
