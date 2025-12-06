'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import useSeries from '@/features/series/domain/hooks/useSeries';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DialogTexts {
  dialogTitle: string;
  dialogDescription: string;
  buttonText: string;
}

const CREATE_TEXTS: DialogTexts = {
  dialogTitle: '새 시리즈',
  dialogDescription: '시리즈를 추가하려면 제목과 설명을 입력하세요',
  buttonText: '만들기',
};

const EDIT_TEXTS: DialogTexts = {
  dialogTitle: '시리즈 수정',
  dialogDescription: '시리즈 정보를 수정합니다.',
  buttonText: '저장',
};

export default function SeriesFormDialog({
  mode,
  userId,
  series,
  isOpen,
  setIsOpen,
}: {
  mode: 'create' | 'edit';
  userId: string;
  series?: SeriesProps;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [title, setTitle] = useState(series?.title ?? '');
  const [description, setDescription] = useState(series?.description ?? '');
  const [isTitleValid, setIsTitleValid] = useState(true);

  const { dialogTitle, dialogDescription, buttonText } =
    mode === 'create' ? CREATE_TEXTS : EDIT_TEXTS;

  const { createSeriesMutation, updateSeriesMutation } = useSeries(userId);
  const isPending =
    mode === 'create'
      ? createSeriesMutation.isPending
      : updateSeriesMutation.isPending;

  const handleCreate = () => {
    if (!title.trim()) {
      setIsTitleValid(false);
      return;
    }

    const params = { title, description: description.trim() || null };

    if (mode === 'create') {
      createSeriesMutation.mutate(params, {
        onSuccess: () => {
          setIsOpen(false);
        },
      });
    } else {
      if (!series) return;
      updateSeriesMutation.mutate(
        { seriesId: series.id, ...params },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTitle(series?.title ?? '');
      setDescription(series?.description ?? '');
      setIsTitleValid(true);
    }
  }, [isOpen, series?.description, series?.title]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>{dialogTitle}</DialogTitle>
        <DialogDescription className='sr-only'>
          {dialogDescription}
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>{dialogTitle}</div>
        <div className='text-sm text-gray-500 mb-6'>{dialogDescription}</div>

        <input
          className={clsx(
            'w-full border p-3 mb-4 rounded-sm outline-none',
            isTitleValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            title ? 'bg-white' : 'bg-gray-50'
          )}
          type='text'
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setIsTitleValid(true);
          }}
          placeholder='제목'
        />

        <textarea
          className='w-full border border-gray-200 hover:border-blue-500 focus:border-blue-500 p-3 mb-8 rounded-sm outline-none resize-none'
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='설명 (선택사항)'
          rows={3}
        />

        <div className='flex justify-between items-center'>
          <button
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-blue-500',
              isPending ? 'bg-blue-500' : 'bg-blue-600'
            )}
            onClick={handleCreate}
          >
            {isPending ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              <span>{buttonText}</span>
            )}
          </button>

          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
