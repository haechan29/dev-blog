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
import { useCallback, useEffect, useState } from 'react';

export default function DialogueSettingsDialog({
  isOpen,
  setIsOpen,
  onSpeakerUpdate,
  editingSpeakerIndex,
  initialName = '',
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSpeakerUpdate: (name: string, index: number | null) => void;
  editingSpeakerIndex: number | null;
  initialName?: string;
}) {
  const isEditMode = editingSpeakerIndex !== null;
  const [newName, setNewName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);

  const handleSpeakerUpdate = useCallback(() => {
    if (!newName.trim()) {
      setIsNameValid(false);
      return;
    }
    onSpeakerUpdate(newName.trim(), editingSpeakerIndex);
    setNewName('');
    setIsOpen(false);
  }, [editingSpeakerIndex, newName, onSpeakerUpdate, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      setNewName(initialName);
      setIsNameValid(true);
    }
  }, [isOpen, initialName]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>
          {isEditMode ? '화자 수정' : '화자 추가'}
        </DialogTitle>
        <DialogDescription className='sr-only'>
          {isEditMode ? '화자 이름을 수정합니다' : '새로운 화자를 추가합니다'}
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>
          {isEditMode ? '화자 수정' : '화자 추가'}
        </div>
        <div className='text-sm text-gray-500 mb-6'>
          {isEditMode ? '화자 이름을 수정합니다' : '새로운 화자를 추가합니다'}
        </div>

        <input
          type='text'
          value={newName}
          onChange={e => {
            setNewName(e.target.value);
            setIsNameValid(true);
          }}
          placeholder='화자 이름'
          autoFocus
          className={clsx(
            'w-full border p-3 mb-8 rounded-sm outline-none',
            isNameValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            newName ? 'bg-white' : 'bg-gray-50'
          )}
        />

        <div className='flex justify-between items-center'>
          <button
            onClick={handleSpeakerUpdate}
            className='flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white bg-blue-600 hover:bg-blue-500'
          >
            {isEditMode ? '수정' : '추가'}
          </button>

          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
