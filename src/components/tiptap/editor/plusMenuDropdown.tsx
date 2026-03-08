'use client';

import { Editor } from '@tiptap/react';
import { Image, List, MessageSquare, Minus, Music, Table } from 'lucide-react';
import type { RefObject } from 'react';

export default function PlusMenuDropdown({
  editor,
  onClose,
  fileInputRef,
  audioInputRef,
}: {
  editor: Editor;
  onClose: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  audioInputRef: RefObject<HTMLInputElement | null>;
}) {
  const menuItems = [
    {
      label: '이미지',
      icon: Image,
      action: () => {
        fileInputRef.current?.click();
        onClose();
      },
    },
    {
      label: 'BGM',
      icon: Music,
      action: () => {
        audioInputRef.current?.click();
        onClose();
      },
    },
    {
      label: '목록',
      icon: List,
      action: () => {
        editor.chain().focus().toggleBulletList().run();
      },
    },
    {
      label: '표',
      icon: Table,
      action: () => {
        editor
          .chain()
          .focus()
          .insertTable({ rows: 2, cols: 2, withHeaderRow: true })
          .run();
        onClose();
      },
    },
    {
      label: '구분선',
      icon: Minus,
      action: () => {
        editor.chain().focus().setHorizontalRule().run();
        onClose();
      },
    },
    {
      label: '대사',
      icon: MessageSquare,
      action: () => {
        editor.chain().focus().setDialogue({ speaker: '화자' }).run();
        onClose();
      },
    },
  ];

  return (
    <div className='absolute right-0 top-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border p-1 min-w-32 z-50'>
      {menuItems.map(item => (
        <button
          key={item.label}
          onClick={item.action}
          className='w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 cursor-pointer'
        >
          <item.icon size={16} className='text-muted-foreground' />
          {item.label}
        </button>
      ))}
    </div>
  );
}
