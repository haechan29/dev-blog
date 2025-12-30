'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApiError } from '@/errors/errors';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export default function InquiryDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [content, setContent] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      return;
    }

    setIsPending(true);
    try {
      await InquiryClientRepository.createInquiry(content);
      toast.success('문의가 접수되었습니다');
      setContent('');
      setIsOpen(false);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : '문의 등록에 실패했습니다';
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  }, [content, setIsOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open);
        if (!open) setContent('');
      }}
    >
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>문의하기 다이얼로그</DialogTitle>
        <DialogDescription className='sr-only'>
          언제든 편하게 남겨주세요. 꼭 확인할게요.
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>문의하기</div>
        <div className='text-sm text-gray-500 mb-4'>
          언제든 편하게 남겨주세요. 꼭 확인할게요.
        </div>

        <textarea
          className={clsx(
            'w-full h-40 p-3 border rounded-sm resize-none outline-none scrollbar-hide',
            content
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'bg-gray-50 border-gray-200 hover:border-blue-500 focus:border-blue-500'
          )}
          placeholder='내용을 입력해주세요'
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={5000}
        />

        <div className='flex justify-between items-center mt-4'>
          <button
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-blue-500',
              isPending ? 'bg-blue-500' : 'bg-blue-600'
            )}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              '보내기'
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
