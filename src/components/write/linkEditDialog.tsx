'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LinkEditDialog({
  isOpen,
  onOpenChange,
  initialUrl = '',
  onSave,
  title = '링크 편집',
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialUrl?: string;
  onSave: (url: string) => void;
  title?: string;
}) {
  const [editUrl, setEditUrl] = useState(initialUrl);
  const [isUrlValid, setIsUrlValid] = useState(true);

  const handleSave = () => {
    if (!editUrl.trim() || !isValidUrl(editUrl)) {
      setIsUrlValid(false);
      return;
    }
    onSave(editUrl);
    onOpenChange(false);
  };

  useEffect(() => {
    if (isOpen) {
      setEditUrl(initialUrl);
      setIsUrlValid(true);
    }
  }, [isOpen, initialUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>{title}</DialogTitle>
        <DialogDescription className='sr-only'>
          링크 URL을 입력할 수 있습니다.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-6'>{title}</div>

        <input
          className={clsx(
            'w-full border p-3 mb-2 rounded-sm outline-none',
            isUrlValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            editUrl ? 'bg-white' : 'bg-gray-50'
          )}
          type='url'
          value={editUrl}
          onChange={e => {
            setEditUrl(e.target.value);
            setIsUrlValid(true);
          }}
          onKeyDown={e => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') handleSave();
          }}
          placeholder='https://example.com'
          autoFocus
        />

        {!isUrlValid && (
          <p className='text-red-500 text-sm mb-6'>
            올바른 URL을 입력해주세요.
          </p>
        )}

        {isUrlValid && <div className='mb-6' />}

        <div className='flex justify-between items-center'>
          <button
            className='flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white bg-blue-600 hover:bg-blue-500'
            onClick={handleSave}
          >
            완료
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
