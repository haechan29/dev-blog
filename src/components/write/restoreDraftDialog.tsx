'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function RestoreDraftDialog({
  draft,
  onRestore,
}: {
  draft: string | null;
  onRestore: (draft: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onConfirmButtonClick = useCallback(() => {
    if (draft) onRestore(draft);
    setIsOpen(false);
  }, [draft, onRestore]);

  useEffect(() => {
    if (draft) setIsOpen(true);
  }, [draft]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>임시저장된 글 불러오기</DialogTitle>
        <DialogDescription className='sr-only'>
          글 내용을 불러올지 선택해주세요.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-1'>
          임시저장된 글이 있습니다
        </div>
        <div className='text-sm text-gray-500 mb-4'>
          이전에 작성하던 글을 불러올까요?
        </div>

        <div className='bg-gray-50 p-4 rounded-sm mb-6 border'>
          <div className='text-sm text-gray-700 line-clamp-3 leading-relaxed break-all'>
            {draft}
          </div>
        </div>

        <div className='flex justify-between items-center'>
          <button
            className='px-6 h-10 rounded-sm font-bold cursor-pointer text-white bg-blue-600 hover:bg-blue-500'
            onClick={onConfirmButtonClick}
          >
            불러오기
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
