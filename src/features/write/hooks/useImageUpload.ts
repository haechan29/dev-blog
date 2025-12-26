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
    async (file: File) => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;

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
        const url = await ImageClientRepository.uploadImage(compressedFile);

        const content = contentEditor.value;
        const cursorPosition = contentEditor.selectionStart;
        const markdown = `:::img{url="${url}" size="medium"}\n:::`;

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
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : '이미지 업로드에 실패했습니다';
        toast.error(message);
      }
    },
    [dispatch]
  );

  return { uploadAndInsert };
}
