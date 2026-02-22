'use client';

import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/media/data/errors/mediaErrors';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { updateNodeById } from '@/lib/tiptap';
import { Editor } from '@tiptap/react';
import imageCompression from 'browser-image-compression';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export default function useTiptapImageUpload(editor: Editor | null) {
  const uploadImage = useCallback(
    async (files: File[]) => {
      if (!editor || files.length === 0) return;

      for (const file of files) {
        const id = nanoid();
        const blobUrl = URL.createObjectURL(file);

        editor
          .chain()
          .focus()
          .setImageWithCaption({ src: blobUrl, id, status: 'loading' })
          .run();

        try {
          const compressedFile =
            file.type === 'image/gif'
              ? file
              : await imageCompression(file, {
                  maxSizeMB: 1,
                  initialQuality: 0.8,
                  maxWidthOrHeight: 1920,
                  useWebWorker: true,
                });

          const uploadedUrl =
            await MediaClientRepository.uploadPostImage(compressedFile);

          URL.revokeObjectURL(blobUrl);

          updateNodeById(editor, 'imageWithCaption', id, {
            src: uploadedUrl,
            status: 'success',
          });
        } catch (error) {
          updateNodeById(editor, 'imageWithCaption', id, { status: 'failed' });

          if (error instanceof DailyQuotaExhaustedError) {
            throw error;
          }

          const message =
            error instanceof ApiError
              ? error.message
              : '이미지 업로드에 실패했습니다';
          toast.error(message);
        }
      }
    },
    [editor]
  );

  return { uploadImage };
}
