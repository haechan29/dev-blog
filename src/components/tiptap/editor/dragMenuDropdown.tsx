'use client';

import { Node as TipTapNode } from '@tiptap/pm/model';
import { Editor } from '@tiptap/react';
import { Trash2 } from 'lucide-react';

export default function DragMenuDropdown({
  editor,
  currentNode,
  onClose,
}: {
  editor: Editor;
  currentNode: { node: TipTapNode; pos: number } | null;
  onClose: () => void;
}) {
  return (
    <div className='absolute right-0 top-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border p-1 min-w-32 z-50'>
      <button
        className='w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer'
        onClick={() => {
          if (currentNode) {
            const { pos, node } = currentNode;
            editor
              .chain()
              .focus()
              .deleteRange({
                from: pos,
                to: pos + node.nodeSize,
              })
              .run();
          }
          onClose();
        }}
      >
        <Trash2 className='w-4 h-4 text-gray-500' />
        <div className='shrink-0 text-gray-900'>삭제</div>
      </button>
    </div>
  );
}
