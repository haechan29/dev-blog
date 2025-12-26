'use client';

import useImageUpload from '@/features/write/hooks/useImageUpload';
import { RootState } from '@/lib/redux/store';
import { ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';

export default function ImageDropzone({ children }: { children: ReactNode }) {
  const currentStepId = useSelector(
    (state: RootState) => state.writePost.currentStepId
  );
  const { uploadAndInsert } = useImageUpload();

  const { getRootProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    noClick: true,
    noKeyboard: true,
    disabled: currentStepId !== 'write',
    onDrop: async files => {
      const file = files[0];
      if (!file) return;
      await uploadAndInsert(file);
    },
  });

  return (
    <div {...getRootProps()} className='w-screen h-dvh flex flex-col'>
      {isDragActive && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-blue-500/10'>
          <p className='text-lg font-medium text-blue-600'>
            이미지를 놓아주세요
          </p>
        </div>
      )}
      {children}
    </div>
  );
}
