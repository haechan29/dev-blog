'use client';

import { getMarkRange } from '@tiptap/core';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { LayoutList, Square, Type } from 'lucide-react';
import { useRef } from 'react';

export default function LinkPasteMenu({ editor }: { editor: Editor | null }) {
  const linkPositionRef = useRef<{ from: number; to: number } | null>(null);

  const markAllLinksAsOld = () => {
    if (!editor) return;

    const { doc, schema } = editor.state;
    const linkType = schema.marks.link;

    doc.descendants((node, pos) => {
      if (node.isText && node.marks.length > 0) {
        const linkMark = node.marks.find(
          mark => mark.type === linkType && mark.attrs.isNewlyInserted === true
        );

        if (linkMark) {
          const currentSelection = editor.state.selection;

          editor
            .chain()
            .setTextSelection({ from: pos, to: pos + node.nodeSize })
            .updateAttributes('link', { isNewlyInserted: false })
            .setTextSelection(currentSelection)
            .run();
        }
      }
    });
  };

  const handleHide = () => {
    markAllLinksAsOld();
    linkPositionRef.current = null;
  };

  const handleSelect = (variant: 'inline' | 'horizontal' | 'vertical') => {
    if (!editor) return;

    if (variant === 'horizontal' || variant === 'vertical') {
      const { href } = editor.getAttributes('link');
      const linkPosition = linkPositionRef.current;

      if (href && linkPosition) {
        editor
          .chain()
          .focus()
          .setTextSelection(linkPosition)
          .deleteSelection()
          .setLinkCard({ href, variant })
          .run();
      }
    }

    handleHide();
  };

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: 'right-start',
        onHide: handleHide,
      }}
      shouldShow={({ editor }) => {
        const { isNewlyInserted } = editor.getAttributes('link');

        if (isNewlyInserted === true) {
          const { from } = editor.state.selection;
          const range = getMarkRange(
            editor.state.doc.resolve(from),
            editor.state.schema.marks.link
          );
          if (range) {
            linkPositionRef.current = { from: range.from, to: range.to };
          }
        }

        return isNewlyInserted === true;
      }}
    >
      <div className='flex bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'>
        <button
          onClick={() => handleSelect('inline')}
          className='flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 text-sm'
        >
          <Type size={16} />
          인라인
        </button>
        <button
          onClick={() => handleSelect('horizontal')}
          className='flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 text-sm'
        >
          <LayoutList size={16} />
          가로 카드
        </button>
        <button
          onClick={() => handleSelect('vertical')}
          className='flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 text-sm'
        >
          <Square size={16} />
          세로 카드
        </button>
      </div>
    </BubbleMenu>
  );
}
