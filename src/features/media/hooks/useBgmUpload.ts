import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/media/data/errors/mediaErrors';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { insertMarkdown } from '@/features/write/domain/lib/insertMarkdown';
import { AppDispatch } from '@/lib/redux/store';
import { setContent } from '@/lib/redux/write/writePostFormSlice';
import { MutableRefObject, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const LOADING_BGM_PATTERN = /::bgm\{[^}]*status="loading"[^}]*\}/;

export default function useBgmUpload({
  isScrollSyncPausedRef,
}: {
  isScrollSyncPausedRef?: MutableRefObject<boolean>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const uploadAndInsert = useCallback(
    async (file: File) => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;

      if (isScrollSyncPausedRef) isScrollSyncPausedRef.current = true;

      const cursorPosition = contentEditor.selectionStart;
      const content = contentEditor.value;

      const { newText, newCursorPosition } = insertMarkdown({
        content,
        cursorPosition,
        markdown: `::bgm{src="" status="loading"}\n`,
      });

      dispatch(setContent({ value: newText, isUserInput: false }));

      try {
        const uploadedUrl = await MediaClientRepository.uploadMedia(file);

        const currentContent = contentEditor.value;
        const updatedContent = currentContent.replace(
          LOADING_BGM_PATTERN,
          `::bgm{src="${uploadedUrl}"}`
        );
        dispatch(setContent({ value: updatedContent, isUserInput: false }));
      } catch (error) {
        const currentContent = contentEditor.value;
        const updatedContent = currentContent.replace(
          LOADING_BGM_PATTERN,
          `::bgm{src="" status="failed"}`
        );
        dispatch(setContent({ value: updatedContent, isUserInput: false }));

        if (error instanceof DailyQuotaExhaustedError) {
          throw error;
        }

        const message =
          error instanceof ApiError
            ? error.message
            : 'BGM 업로드에 실패했습니다';
        toast.error(message);
      }

      setTimeout(() => {
        if (isScrollSyncPausedRef) isScrollSyncPausedRef.current = false;
        contentEditor.focus();
        contentEditor.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 100);
    },
    [dispatch, isScrollSyncPausedRef]
  );

  return { uploadAndInsert };
}
