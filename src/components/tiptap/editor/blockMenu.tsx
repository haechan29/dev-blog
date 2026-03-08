'use client';

import DragMenuDropdown from '@/components/tiptap/editor/dragMenuDropdown';
import PlusMenuDropdown from '@/components/tiptap/editor/plusMenuDropdown';
import { uploadBgm } from '@/features/media/utils/uploadBgm';
import { uploadImage } from '@/features/media/utils/uploadImage';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

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
            fileInputRef={fileInputRef}
            audioInputRef={audioInputRef}
          />
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          onChange={e => {
            const files = e.target.files;
            if (files && files.length > 0 && editor) {
              uploadImage(editor, Array.from(files));
            }
            e.target.value = '';
          }}
          className='hidden'
        />
        <input
          ref={audioInputRef}
          type='file'
          accept='audio/mpeg'
          onChange={async e => {
            const file = e.target.files?.[0];
            if (file && editor) {
              await uploadBgm(editor, file);
            }
            e.target.value = '';
          }}
          className='hidden'
        />

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
