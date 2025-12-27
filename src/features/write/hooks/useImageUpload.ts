import { RateLimitError } from '@/features/image/data/errors/imageErrors';
import * as ImageClientRepository from '@/features/image/data/repository/imageClientRepository';
import { insertMarkdown } from '@/features/write/domain/lib/insertMarkdown';
import { ApiError } from '@/lib/api';
import { AppDispatch } from '@/lib/redux/store';
import { setContent } from '@/lib/redux/write/writePostFormSlice';
import imageCompression from 'browser-image-compression';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export default function useImageUpload() {
  const dispatch = useDispatch<AppDispatch>();

  const uploadAndInsert = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;

      const results = await Promise.allSettled(
        files.map(async file => {
          const compressedFile =
            file.type === 'image/gif'
              ? file
              : await imageCompression(file, {
                  maxSizeMB: 1,
                  initialQuality: 0.8,
                  maxWidthOrHeight: 1920,
                  useWebWorker: true,
                });
          return ImageClientRepository.uploadImage(compressedFile);
        })
      );

      for (const result of results) {
        if (result.status !== 'rejected') continue;

        const error = result.reason;
        if (error instanceof RateLimitError) {
          throw error;
        }

        const message =
          error instanceof ApiError
            ? error.message
            : '이미지 업로드에 실패했습니다';
        toast.error(message);
        break;
      }

      const content = contentEditor.value;
      const cursorPosition = contentEditor.selectionStart;
      const markdown = results
        .map((result, index) => {
          return result.status === 'fulfilled'
            ? `:::img{url="${result.value}" size="medium" error="false"}\n:::`
            : `:::img{url="${URL.createObjectURL(
                files[index]
              )}" size="medium" error="true"}\n:::`;
        })
        .join('\n\n');

      const { newText, newCursorPosition } = insertMarkdown({
        content,
        cursorPosition,
        markdown,
      });

      dispatch(setContent({ value: newText, isUserInput: false }));

      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 100);
    },
    [dispatch]
  );

  return { uploadAndInsert };
}
