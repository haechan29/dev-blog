'use client';

import DragMenuDropdown from '@/components/tiptap/editor/dragMenuDropdown';
import { clearDropCursor } from '@/lib/tiptap';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { Node as TipTapNode } from '@tiptap/pm/model';
import { Editor } from '@tiptap/react';
import clsx from 'clsx';
import { GripVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function BlockMenu({ editor }: { editor: Editor | null }) {
  const [isDragMenuOpen, setIsDragMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<{ node: TipTapNode; pos: number } | null>(null);

  useEffect(() => {
    if (!isDragMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsDragMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDragMenuOpen]);

  if (!editor) return null;

  return (
    <DragHandle
      editor={editor}
      onElementDragEnd={clearDropCursor}
      onNodeChange={({ node, pos }) => {
        currentNodeRef.current = node ? { node, pos } : null;
        setIsDragMenuOpen(false);
      }}
    >
      <div ref={menuRef} className='relative flex items-center right-2'>
        <button
          className={clsx(
            'w-6 h-6 flex items-center justify-center cursor-grab hover:bg-gray-100 rounded',
            isDragMenuOpen && 'bg-gray-100'
          )}
          onClick={() => {
            setIsDragMenuOpen(!isDragMenuOpen);

            if (!isDragMenuOpen && currentNodeRef.current) {
              const { pos } = currentNodeRef.current;
              editor.chain().focus().setNodeSelection(pos).run();
            }
          }}
        >
          <GripVertical className='w-4 h-4 text-gray-400' />
        </button>

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
