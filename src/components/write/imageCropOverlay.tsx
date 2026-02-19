'use client';

import useScrollLock from '@/hooks/useScrollLock';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageCropOverlay({
  imageUrl,
  isOpen,
  setIsOpen,
  onConfirm,
}: {
  imageUrl: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: (croppedFile: File) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const handleConfirm = useCallback(() => {
    if (!imgRef.current || !completedCrop) return;
    const img = imgRef.current;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'cropped-image.webp', {
          type: 'image/webp',
        });
        onConfirm(file);
        setIsOpen(false);
      }
    }, 'image/webp');
  }, [completedCrop, onConfirm, setIsOpen]);

  const handleCancel = useCallback(() => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setIsOpen(false);
  }, [setIsOpen]);

  useScrollLock({ isLocked: isOpen });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel();
      if (e.key === 'Enter' && completedCrop) handleConfirm();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [completedCrop, handleCancel, handleConfirm, isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-neutral-900 flex flex-col'>
      <div className='flex justify-between items-center p-2 text-white'>
        <button
          onClick={handleCancel}
          className='p-2 ml-2 hover:bg-white/10 rounded-full'
        >
          <X size={20} />
        </button>
        <span className='font-semibold'>이미지 크롭</span>
        <button
          onClick={handleConfirm}
          disabled={!completedCrop}
          className='h-9 text-sm font-semibold py-2 px-4 mr-2 bg-blue-600 hover:bg-blue-500 rounded-full disabled:opacity-50'
        >
          적용
        </button>
      </div>

      <div className='flex-1 min-h-0 flex items-center justify-center p-2'>
        <ReactCrop
          crop={crop}
          onChange={c => setCrop(c)}
          onComplete={c => setCompletedCrop(c)}
          style={{ maxHeight: 'calc(100vh - 68px)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt='크롭할 이미지'
            className='max-h-[calc(100vh-68px)] max-w-full object-contain'
          />
        </ReactCrop>
      </div>
    </div>
  );
}
