import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/media/data/errors/mediaErrors';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { AppDispatch } from '@/lib/redux/store';
import { setContent } from '@/lib/redux/write/writePostFormSlice';
import imageCompression from 'browser-image-compression';
import { MutableRefObject, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export default function useImageCrop({
  isScrollSyncPausedRef,
}: {
  isScrollSyncPausedRef?: MutableRefObject<boolean>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const cropAndReplace = useCallback(
    async (croppedFile: File, originalUrl: string) => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;

      if (isScrollSyncPausedRef) isScrollSyncPausedRef.current = true;

      const content = contentEditor.value;
      const loadingContent = content.replace(
        `url="${originalUrl}"`,
        `url="${originalUrl}" status="loading"`
      );
      dispatch(setContent({ value: loadingContent, isUserInput: false }));

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

        const baseUrl =
          await MediaClientRepository.uploadPostImage(compressedFile);

        const currentContent = contentEditor.value;
        const updatedContent = currentContent.replace(
          `url="${originalUrl}" status="loading"`,
          `url="${baseUrl}"`
        );
        dispatch(setContent({ value: updatedContent, isUserInput: false }));
      } catch (error) {
        const currentContent = contentEditor.value;
        const revertedContent = currentContent.replace(
          `url="${originalUrl}" status="loading"`,
          `url="${originalUrl}"`
        );
        dispatch(setContent({ value: revertedContent, isUserInput: false }));

        if (error instanceof DailyQuotaExhaustedError) {
          throw error;
        }

        const message =
          error instanceof ApiError
            ? error.message
            : '이미지 업로드에 실패했습니다';
        toast.error(message);
      } finally {
        if (isScrollSyncPausedRef) isScrollSyncPausedRef.current = false;
      }
    },
    [dispatch, isScrollSyncPausedRef]
  );

  return { cropAndReplace };
}
