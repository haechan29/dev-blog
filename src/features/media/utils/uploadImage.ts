import { ApiError } from '@/errors/errors';
import { DailyQuotaExhaustedError } from '@/features/media/data/errors/mediaErrors';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { clearDropCursor, updateNodeById } from '@/lib/tiptap';
import { Editor } from '@tiptap/core';
import imageCompression from 'browser-image-compression';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

export async function uploadImage(
  editor: Editor,
  files: File[],
  pos?: number
): Promise<void> {
  if (files.length === 0) return;

  clearDropCursor();

  const uploadItems = files.map(file => ({
    file,
    id: nanoid(),
    blobUrl: URL.createObjectURL(file),
  }));

  const content = uploadItems.map(({ id, blobUrl }) => ({
    type: 'imageWithCaption',
    attrs: { src: blobUrl, id, status: 'loading' },
  }));

  if (typeof pos === 'number') {
    editor.chain().focus().insertContentAt(pos, content).run();
  } else {
    editor.chain().focus().insertContent(content).run();
  }

  for (const { file, id, blobUrl } of uploadItems) {
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
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }
}
