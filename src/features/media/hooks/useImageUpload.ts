import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/media/data/errors/mediaErrors';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { insertMarkdown } from '@/features/write/domain/lib/insertMarkdown';
import { AppDispatch } from '@/lib/redux/store';
import { setContent } from '@/lib/redux/write/writePostFormSlice';
import imageCompression from 'browser-image-compression';
import { MutableRefObject, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const LOADING_IMAGE_PATTERN = /:::img\{[^}]*status="loading"[^}]*\}/;

function updateContentWithCursorPreserve(
  contentEditor: HTMLTextAreaElement,
  dispatch: AppDispatch,
  newContent: string
) {
  const prevLength = contentEditor.value.length;
  const cursorStart = contentEditor.selectionStart;
  const cursorEnd = contentEditor.selectionEnd;

  dispatch(setContent({ value: newContent, isUserInput: false }));

  const delta = newContent.length - prevLength;
  const newCursorStart = Math.max(0, cursorStart + delta);
  const newCursorEnd = Math.max(0, cursorEnd + delta);

  requestAnimationFrame(() => {
    contentEditor.setSelectionRange(newCursorStart, newCursorEnd);
  });

  return delta;
}

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
          markdown: `:::img{url="${blobUrl}" status="loading" size="medium"}\n:::`,
        });

        updateContentWithCursorPreserve(contentEditor, dispatch, newText);
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
          const delta = updateContentWithCursorPreserve(
            contentEditor,
            dispatch,
            updatedContent
          );
          cursorPosition += delta;
        } catch (error) {
          const currentContent = contentEditor.value;
          const updatedContent = currentContent.replace(
            LOADING_IMAGE_PATTERN,
            `:::img{url="${blobUrl}" status="failed" size="medium"}`
          );
          const delta = updateContentWithCursorPreserve(
            contentEditor,
            dispatch,
            updatedContent
          );
          cursorPosition += delta;

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

      if (isScrollSyncPausedRef) isScrollSyncPausedRef.current = false;
    },
    [dispatch, isScrollSyncPausedRef]
  );

  return { uploadAndInsert };
}
