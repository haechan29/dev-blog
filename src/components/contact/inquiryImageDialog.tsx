'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export default function InquiryImageDialog({
  imagePreview,
  setImagePreview,
}: {
  imagePreview: {
    src: string;
    alt: string;
  } | null;
  setImagePreview: (
    imagePreview: {
      src: string;
      alt: string;
    } | null
  ) => void;
}) {
  return (
    <Dialog
      open={imagePreview !== null}
      onOpenChange={open => {
        if (!open) setImagePreview(null);
      }}
    >
      <DialogContent
        showCloseButton={false}
        onClick={() => setImagePreview(null)}
        className={cn(
          'fixed inset-0 flex flex-col p-10 sm:p-20 max-w-none translate-x-0 translate-y-0',
          'gap-0 rounded-none border-0 bg-transparent shadow-none outline-none sm:max-w-none'
        )}
      >
        <DialogTitle className='sr-only'>첨부 이미지 크게 보기</DialogTitle>
        <DialogDescription className='sr-only'>
          닫으려면 바깥 영역을 누르거나 닫기 버튼을 사용하세요.
        </DialogDescription>
        {imagePreview && (
          <>
            <div className='flex min-h-0 min-w-0 flex-1 items-center justify-center'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview.src}
                alt={imagePreview.alt}
                draggable={false}
                className='max-h-full max-w-full object-contain'
                onClick={e => e.stopPropagation()}
              />
            </div>
            <DialogClose
              className={cn(
                'absolute top-4 right-4 flex size-10 items-center justify-center rounded-full',
                'bg-black/60 text-white hover:bg-black/80',
                'focus:ring-2 focus:ring-white/80 focus:outline-none'
              )}
              aria-label='닫기'
            >
              <X size={22} strokeWidth={2} aria-hidden />
            </DialogClose>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
