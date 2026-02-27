'use client';

import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Columns, Rows } from 'lucide-react';

export default function TableMenu({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const getTableElement = () => {
    const { view } = editor;
    const { from } = editor.state.selection;
    const domAtPos = view.domAtPos(from);
    const node = domAtPos.node;
    const tableEl =
      (node as HTMLElement).closest?.('table') ||
      node.parentElement?.closest('table');
    return tableEl;
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey='table-menu'
      options={{
        placement: 'top',
        offset: 8,
      }}
      getReferencedVirtualElement={() => {
        const tableEl = getTableElement();
        if (tableEl) {
          return {
            getBoundingClientRect: () => tableEl.getBoundingClientRect(),
          };
        }
        return null;
      }}
      shouldShow={({ editor }) => editor.isActive('table')}
    >
      <div className='flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1'>
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className='flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
        >
          <Rows size={16} />행 추가
        </button>

        <div className='w-px h-5 bg-gray-200' />

        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className='flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
        >
          <Columns size={16} />열 추가
        </button>
      </div>
    </BubbleMenu>
  );
}
