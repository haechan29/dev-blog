'use client';

import Tooltip from '@/components/tooltip';
import { uploadBgm } from '@/features/media/utils/uploadBgm';
import { uploadImage } from '@/features/media/utils/uploadImage';
import { Editor } from '@tiptap/react';
import clsx from 'clsx';
import { Image, List, MessageSquare, Minus, Music, Table } from 'lucide-react';
import { useRef } from 'react';

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const items = [
    {
      key: '사진',
      label: '사진',
      icon: Image,
      onClick: () => fileInputRef.current?.click(),
    },
    {
      key: 'BGM',
      label: 'BGM',
      icon: Music,
      onClick: () => audioInputRef.current?.click(),
    },
    {
      key: '목록',
      label: '목록',
      icon: List,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      key: '표',
      label: '표',
      icon: Table,
      onClick: () =>
        editor
          ?.chain()
          .focus()
          .insertTable({ rows: 2, cols: 2, withHeaderRow: true })
          .run(),
    },
    {
      key: '구분선',
      label: '구분선',
      icon: Minus,
      onClick: () => editor?.chain().focus().setHorizontalRule().run(),
    },
    {
      key: '대사',
      label: '대사',
      icon: MessageSquare,
      onClick: () =>
        editor?.chain().focus().setDialogue({ speaker: '화자' }).run(),
    },
  ] as const;

  if (!editor) return null;

  return (
    <div
      className={clsx(
        'sticky top-(--toolbar-height) z-40 w-full mb-10',
        'p-1 gap-1 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-md'
      )}
    >
      <div className='w-full flex px-2 py-1 gap-1 overflow-x-auto scrollbar-hide border-gray-200'>
        {items.map(item => (
          <Tooltip key={item.key} text={item.label} direction='top'>
            <button
              type='button'
              onClick={item.onClick}
              className='w-8 h-8 flex items-center justify-center shrink-0 p-2 rounded hover:bg-gray-100 cursor-pointer'
            >
              <item.icon className='w-4 h-4 text-gray-700' />
            </button>
          </Tooltip>
        ))}
      </div>

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
    </div>
  );
}
