'use client';

import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/media/data/errors/mediaErrors';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { updateNodeById } from '@/lib/tiptap';
import { Editor } from '@tiptap/react';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export default function useBgmUpload(editor: Editor | null) {
  const uploadBgm = useCallback(
    async (file: File) => {
      if (!editor) return;

      const id = nanoid();

      editor.commands.setBgm({
        id,
        src: '',
        status: 'loading',
      });

      try {
        const uploadedUrl = await MediaClientRepository.uploadAudio(file);
        updateNodeById(editor, 'bgm', id, { src: uploadedUrl, status: null });
      } catch (error) {
        updateNodeById(editor, 'bgm', id, { status: 'failed' });

        if (error instanceof DailyQuotaExhaustedError) {
          throw error;
        }

        const message =
          error instanceof ApiError
            ? error.message
            : 'BGM 업로드에 실패했습니다';
        toast.error(message);
      }
    },
    [editor]
  );

  return { uploadBgm };
}
