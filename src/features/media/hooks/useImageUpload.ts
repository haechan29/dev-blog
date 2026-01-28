import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/media/data/errors/mediaErrors';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { insertMarkdown } from '@/features/write/domain/lib/insertMarkdown';
import { scrollToCaretIfNeeded } from '@/lib/offset';
import { AppDispatch } from '@/lib/redux/store';
import { setContent } from '@/lib/redux/write/writePostFormSlice';
import imageCompression from 'browser-image-compression';
import { MutableRefObject, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const LOADING_IMAGE_PATTERN = /:::img\{[^}]*status="loading"[^}]*\}/;

export default function useImageUpload({
  isScrollSyncPausedRef,
}: {
  isScrollSyncPausedRef?: MutableRefObject<boolean>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const uploadAndInsert = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;

      if (isScrollSyncPausedRef) isScrollSyncPausedRef.current = true;

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

          const uploadedUrl =
            await MediaClientRepository.uploadMedia(compressedFile);
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
        if (isScrollSyncPausedRef) isScrollSyncPausedRef.current = false;
        contentEditor.focus();
        contentEditor.setSelectionRange(cursorPosition, cursorPosition);
        scrollToCaretIfNeeded(contentEditor);
      }, 100);
    },
    [dispatch, isScrollSyncPausedRef]
  );

  return { uploadAndInsert };
}
