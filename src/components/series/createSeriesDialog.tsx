'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import useSeries from '@/features/series/domain/hooks/useSeries';
import { ApiError } from '@/lib/api';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateSeriesDialog({
  userId,
  isOpen,
  setIsOpen,
}: {
  userId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setIsTitleValid(true);
    }
  }, [isOpen]);

  const { createSeriesMutation } = useSeries(userId);
  const createSeries = useCallback(
    (params: { title: string; description: string | null }) => {
      createSeriesMutation.mutate(params, {
        onSuccess: () => {
          setIsOpen(false);
          toast.success('시리즈가 생성되었습니다');
        },
        onError: error => {
          const message =
            error instanceof ApiError
              ? error.message
              : '시리즈 생성에 실패했습니다';
          toast.error(message);
        },
      });
    },
    [createSeriesMutation, setIsOpen]
  );

  const handleCreate = () => {
    if (!title.trim()) {
      setIsTitleValid(false);
      return;
    }

    createSeries({
      title,
      description: description.trim() || null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>시리즈 추가 다이어로그</DialogTitle>
        <DialogDescription className='sr-only'>
          새로운 시리즈를 생성합니다.
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>새 시리즈</div>
        <div className='text-sm text-gray-500 mb-6'>
          시리즈를 추가하려면 제목과 설명을 입력하세요
        </div>

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
              createSeriesMutation.isPending ? 'bg-blue-500' : 'bg-blue-600'
            )}
            onClick={handleCreate}
          >
            {createSeriesMutation.isPending ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              '만들기'
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
