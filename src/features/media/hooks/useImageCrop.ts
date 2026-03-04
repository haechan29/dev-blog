'use client';

import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/media/data/errors/mediaErrors';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { updateNodeById } from '@/lib/tiptap';
import { Editor } from '@tiptap/react';
import imageCompression from 'browser-image-compression';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export default function useImageCrop(editor: Editor | null) {
  const cropImage = useCallback(
    async (croppedFile: File, nodeId: string) => {
      if (!editor) return;

      updateNodeById(editor, 'imageWithCaption', nodeId, { status: 'loading' });

      try {
        const compressedFile =
          croppedFile.type === 'image/gif'
            ? croppedFile
            : await imageCompression(croppedFile, {
                maxSizeMB: 1,
                initialQuality: 0.8,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
              });

        const uploadedUrl =
          await MediaClientRepository.uploadPostImage(compressedFile);

        updateNodeById(editor, 'imageWithCaption', nodeId, {
          src: uploadedUrl,
          status: 'success',
        });
      } catch (error) {
        updateNodeById(editor, 'imageWithCaption', nodeId, {
          status: undefined,
        });

        if (error instanceof DailyQuotaExhaustedError) {
          throw error;
        }

        const message =
          error instanceof ApiError
            ? error.message
            : '이미지 업로드에 실패했습니다';
        toast.error(message);
      }
    },
    [editor]
  );

  return { cropImage };
}
