'use client';

import DragMenuDropdown from '@/components/tiptap/editor/dragMenuDropdown';
import PlusMenuDropdown from '@/components/tiptap/editor/plusMenuDropdown';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { Node as TipTapNode } from '@tiptap/pm/model';
import { Editor } from '@tiptap/react';
import clsx from 'clsx';
import { GripVertical, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function BlockMenu({ editor }: { editor: Editor | null }) {
  const [isDragMenuOpen, setIsDragMenuOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<{ node: TipTapNode; pos: number } | null>(null);

  useEffect(() => {
    if (!isDragMenuOpen && !isPlusMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsDragMenuOpen(false);
        setIsPlusMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDragMenuOpen, isPlusMenuOpen]);

  if (!editor) return null;

  return (
    <DragHandle
      editor={editor}
      onElementDragEnd={() => {
        const dropCursor = document.querySelector(
          '.prosemirror-dropcursor-block, .prosemirror-dropcursor-inline'
        );
        if (dropCursor) {
          dropCursor.remove();
        }
      }}
      onNodeChange={({ node, pos }) => {
        currentNodeRef.current = node ? { node, pos } : null;
        setIsDragMenuOpen(false);
        setIsPlusMenuOpen(false);
      }}
    >
      <div ref={menuRef} className='relative flex items-center right-2'>
        <button
          className='w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded'
          onClick={() => {
            setIsPlusMenuOpen(!isPlusMenuOpen);
            setIsDragMenuOpen(false);

            if (!isPlusMenuOpen && currentNodeRef.current) {
              const { node, pos } = currentNodeRef.current;
              editor
                .chain()
                .focus()
                .setTextSelection(pos + node.nodeSize)
                .run();
            }
          }}
        >
          <Plus className='w-4 h-4 text-gray-400' />
        </button>

        <button
          className={clsx(
            'w-6 h-6 flex items-center justify-center cursor-grab hover:bg-gray-100 rounded',
            isDragMenuOpen && 'bg-gray-100'
          )}
          onClick={() => {
            setIsDragMenuOpen(!isDragMenuOpen);
            setIsPlusMenuOpen(false);

            if (!isDragMenuOpen && currentNodeRef.current) {
              const { pos } = currentNodeRef.current;
              editor.chain().focus().setNodeSelection(pos).run();
            }
          }}
        >
          <GripVertical className='w-4 h-4 text-gray-400' />
        </button>

        {isPlusMenuOpen && (
          <PlusMenuDropdown
            editor={editor}
            onClose={() => setIsPlusMenuOpen(false)}
          />
        )}

        {isDragMenuOpen && (
          <DragMenuDropdown
            editor={editor}
            currentNode={currentNodeRef.current}
            onClose={() => setIsDragMenuOpen(false)}
          />
        )}
      </div>
    </DragHandle>
  );
}
