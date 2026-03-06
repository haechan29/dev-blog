'use client';

import { uploadBgm } from '@/features/media/utils/uploadBgm';
import { uploadImage } from '@/features/media/utils/uploadImage';
import { Editor } from '@tiptap/react';
import { Image, List, MessageSquare, Minus, Music, Table } from 'lucide-react';
import { useRef } from 'react';

export default function PlusMenuDropdown({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

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
        onClose();
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
        editor.chain().focus().setDialogue({ speaker: '화자 1' }).run();
        onClose();
      },
    },
  ];

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={e => {
          const files = e.target.files;
          if (files && files.length > 0) {
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
          if (file) {
            await uploadBgm(editor, file);
          }
          e.target.value = '';
        }}
        className='hidden'
      />

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
    </>
  );
}
