'use client';

import { INQUIRY_MAX_IMAGES } from '@/features/inquiry/constants/inquiry';
import type { InquiryImageProps } from '@/features/inquiry/ui/model/inquiryImageProps';
import {
  ChangeEvent,
  ClipboardEvent,
  DragEvent,
  useCallback,
  useEffect,
} from 'react';

function isImageFile(file: File | DataTransferItem): boolean {
  return file.type.startsWith('image/');
}

function pickImageFilesFromDataTransfer(data: DataTransfer | null): File[] {
  if (!data) return [];

  const fromFiles = Array.from(data.files).filter(isImageFile);
  if (fromFiles.length) return fromFiles;

  const fromItems = Array.from(data.items)
    .filter(item => item.kind === 'file' && isImageFile(item))
    .map(item => item.getAsFile())
    .filter(file => !!file);
  return fromItems;
}

export default function useImages({
  images,
  isFileDragOver,
  canAddMoreImages,
  setIsFileDragOver,
  onImageFilesPicked,
}: {
  images: InquiryImageProps[];
  isFileDragOver: boolean;
  canAddMoreImages: boolean;
  setIsFileDragOver: (isFileDragOver: boolean) => void;
  onImageFilesPicked: (files: File[]) => void;
}) {
  const attachImageFiles = useCallback(
    (files: File[]) => {
      if (!files.length || !canAddMoreImages) return;
      const imageFiles = files.filter(isImageFile);
      if (!imageFiles.length) return;

      const left = INQUIRY_MAX_IMAGES - images.length;
      const sliced = imageFiles.slice(0, left);
      if (sliced.length) onImageFilesPicked(sliced);
    },
    [canAddMoreImages, images.length, onImageFilesPicked]
  );

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files;
    if (picked) {
      attachImageFiles(Array.from(picked));
    }
    e.target.value = '';
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setIsFileDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragOver(false);
    attachImageFiles(Array.from(e.dataTransfer.files));
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const imageFiles = pickImageFilesFromDataTransfer(e.clipboardData);
    if (imageFiles.length > 0) {
      e.preventDefault();
      attachImageFiles(imageFiles);
    }
  };

  useEffect(() => {
    if (!isFileDragOver) return;
    const onDragEnd = () => setIsFileDragOver(false);
    window.addEventListener('dragend', onDragEnd);
    return () => window.removeEventListener('dragend', onDragEnd);
  }, [isFileDragOver, setIsFileDragOver]);

  return {
    handleFileInputChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handlePaste,
  };
}
