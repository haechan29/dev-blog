'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { X } from 'lucide-react';

export default function DailyQuotaExhaustedDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouterWithProgress();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>
          일일 이미지 업로드 용량 초과
        </DialogTitle>
        <DialogDescription className='sr-only'>
          오늘 이미지 업로드 용량을 모두 사용했습니다.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-1'>
          오늘 업로드 용량을 다 사용했어요
        </div>
        <div className='text-sm text-gray-500 mb-8'>
          내일 다시 업로드할 수 있어요. 용량도 넉넉하게 늘려둘게요.
        </div>

        <div className='flex justify-between items-center'>
          <button
            className='px-6 h-10 rounded-sm font-bold cursor-pointer text-white bg-blue-600 hover:bg-blue-500'
            onClick={() => {
              setIsOpen(false);
              router.push('/');
            }}
          >
            저장하고 홈으로
          </button>

          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
