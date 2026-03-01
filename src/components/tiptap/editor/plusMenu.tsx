'use client';

import useTiptapBgmUpload from '@/features/media/hooks/useTiptapBgmUpload';
import useTiptapImageUpload from '@/features/media/hooks/useTiptapImageUpload';
import { Editor } from '@tiptap/react';
import { FloatingMenu } from '@tiptap/react/menus';
import {
  Image,
  List,
  MessageSquare,
  Minus,
  Music,
  Plus,
  Table,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function PlusMenu({ editor }: { editor: Editor | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { uploadImage } = useTiptapImageUpload(editor);
  const { uploadBgm } = useTiptapBgmUpload(editor);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  if (!editor) return null;

  const menuItems = [
    {
      label: '이미지',
      icon: Image,
      action: () => {
        fileInputRef.current?.click();
        setIsOpen(false);
      },
    },
    {
      label: 'BGM',
      icon: Music,
      action: () => {
        audioInputRef.current?.click();
        setIsOpen(false);
      },
    },
    {
      label: '목록',
      icon: List,
      action: () => {
        editor.chain().focus().toggleBulletList().run();
        setIsOpen(false);
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
        setIsOpen(false);
      },
    },
    {
      label: '구분선',
      icon: Minus,
      action: () => {
        editor.chain().focus().setHorizontalRule().run();
        setIsOpen(false);
      },
    },
    {
      label: '대사',
      icon: MessageSquare,
      action: () => {
        editor.chain().focus().setDialogue({ speaker: '화자 1' }).run();
        setIsOpen(false);
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
            uploadImage(Array.from(files));
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
            await uploadBgm(file);
          }
          e.target.value = '';
        }}
        className='hidden'
      />

      <FloatingMenu
        editor={editor}
        pluginKey='plus-menu'
        options={{
          placement: 'left',
        }}
      >
        <div ref={menuRef} className='relative'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600'
          >
            <Plus size={18} />
          </button>

          {isOpen && (
            <div className='absolute left-8 top-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border p-1 min-w-32 z-50'>
              {menuItems.map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className='w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2'
                >
                  <item.icon size={16} className='text-muted-foreground' />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </FloatingMenu>
    </>
  );
}
