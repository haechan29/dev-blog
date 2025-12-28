import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/image/data/errors/imageErrors';
import * as ImageClientRepository from '@/features/image/data/repository/imageClientRepository';
import { insertMarkdown } from '@/features/write/domain/lib/insertMarkdown';
import { AppDispatch } from '@/lib/redux/store';
import { setContent } from '@/lib/redux/write/writePostFormSlice';
import imageCompression from 'browser-image-compression';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const LOADING_IMAGE_PATTERN = /:::img\{[^}]*status="loading"[^}]*\}/;

export default function useImageUpload() {
  const dispatch = useDispatch<AppDispatch>();

  const uploadAndInsert = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;

      let cursorPosition = contentEditor.selectionStart;

      for (const file of files) {
        const blobUrl = URL.createObjectURL(file);

        const content = contentEditor.value;
        const { newText, newCursorPosition } = insertMarkdown({
          content,
          cursorPosition,
          markdown: `:::img{url="${blobUrl}" status="loading" size="medium"}\n:::\n\n`,
        });

        dispatch(setContent({ value: newText, isUserInput: false }));
        cursorPosition = newCursorPosition;

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

          const uploadedUrl = await ImageClientRepository.uploadImage(
            compressedFile
          );
          URL.revokeObjectURL(blobUrl);

          const currentContent = contentEditor.value;
          const updatedContent = currentContent.replace(
            LOADING_IMAGE_PATTERN,
            `:::img{url="${uploadedUrl}" size="medium"}`
          );
          dispatch(setContent({ value: updatedContent, isUserInput: false }));
        } catch (error) {
          const currentContent = contentEditor.value;
          const updatedContent = currentContent.replace(
            LOADING_IMAGE_PATTERN,
            `:::img{url="${blobUrl}" status="failed" size="medium"}`
          );
          dispatch(setContent({ value: updatedContent, isUserInput: false }));

          if (error instanceof DailyQuotaExhaustedError) {
            throw error;
          }

          const message =
            error instanceof ApiError
              ? error.message
              : '이미지 업로드에 실패했습니다';
          toast.error(message);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(cursorPosition, cursorPosition);
      }, 100);
    },
    [dispatch]
  );

  return { uploadAndInsert };
}
