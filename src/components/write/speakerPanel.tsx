'use client';

import SpeakerSettingsDialog from '@/components/write/speakerSettingsDialog';
import { ApiError } from '@/errors/errors';
import * as ImageClientRepository from '@/features/image/data/repository/imageClientRepository';
import useContentToolbar from '@/features/write/hooks/useContentToolbar';
import { colors, getColorIndex } from '@/lib/color';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { setContent } from '@/lib/redux/write/writePostFormSlice';
import imageCompression from 'browser-image-compression';
import clsx from 'clsx';
import { ChevronLeft, Loader2, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const DEFAULT_CONTENT = '내용을 입력해주세요.';

interface Avatar {
  url: string;
  status: 'loading' | 'done';
}

interface Speaker {
  name: string;
  avatars: Avatar[];
}

export default function SpeakerPanel({
  isSpeakerPanelOpen,
  setIsSpeakerPanelOpen,
}: {
  isSpeakerPanelOpen: boolean;
  setIsSpeakerPanelOpen: (open: boolean) => void;
}) {
  const {
    contentToolbar: { shouldAttachToolbarToBottom, toolbarTranslateY },
  } = useContentToolbar();
  const content = useSelector(
    (state: RootState) => state.writePostForm.content.value
  );
  const dispatch = useDispatch<AppDispatch>();

  const [speakers, setSpeakers] = useState<Speaker[]>([
    { name: '호스트', avatars: [] },
    { name: '게스트', avatars: [] },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpeakerIndex, setEditingSpeakerIndex] = useState<number | null>(
    null
  );
  const uploadTargetIndexRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarUpload = useCallback(async (file: File) => {
    if (uploadTargetIndexRef.current === null) return;

    const targetIndex = uploadTargetIndexRef.current;
    uploadTargetIndexRef.current = null;

    const blobUrl = URL.createObjectURL(file);

    setSpeakers(prev =>
      prev.map((speaker, i) =>
        i === targetIndex
          ? {
              ...speaker,
              avatars: [
                ...speaker.avatars,
                { url: blobUrl, status: 'loading' as const },
              ],
            }
          : speaker
      )
    );

    try {
      const compressedFile =
        file.type === 'image/gif'
          ? file
          : await imageCompression(file, {
              maxSizeMB: 1,
              initialQuality: 0.8,
              maxWidthOrHeight: 256,
              useWebWorker: true,
            });

      const uploadedUrl =
        await ImageClientRepository.uploadImage(compressedFile);
      URL.revokeObjectURL(blobUrl);

      setSpeakers(prev =>
        prev.map((speaker, i) =>
          i === targetIndex
            ? {
                ...speaker,
                avatars: speaker.avatars.map(avatar =>
                  avatar.url === blobUrl
                    ? { url: uploadedUrl, status: 'done' as const }
                    : avatar
                ),
              }
            : speaker
        )
      );
    } catch (error) {
      setSpeakers(prev =>
        prev.map((speaker, i) =>
          i === targetIndex
            ? {
                ...speaker,
                avatars: speaker.avatars.filter(a => a.url !== blobUrl),
              }
            : speaker
        )
      );

      const message =
        error instanceof ApiError
          ? error.message
          : '이미지 업로드에 실패했습니다';
      toast.error(message);
    }
  }, []);

  const insertDialogue = useCallback(
    (speaker: string, avatar?: string) => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;

      const { selectionStart, selectionEnd } = contentEditor;
      const textBefore = content.substring(0, selectionStart);
      const textAfter = content.substring(selectionEnd);

      const attrs = avatar
        ? `speaker="${speaker}" avatar="${avatar}"`
        : `speaker="${speaker}"`;
      const directive = `:::dialogue{${attrs}}\n${DEFAULT_CONTENT}\n:::`;

      const shouldBreakBefore = textBefore.trim() && !textBefore.endsWith('\n');
      const shouldBreakAfter = textAfter.trim() && !textAfter.startsWith('\n');

      const newText =
        textBefore +
        (shouldBreakBefore ? '\n' : '') +
        directive +
        (shouldBreakAfter ? '\n' : '') +
        textAfter;

      const contentStart =
        textBefore.length +
        (shouldBreakBefore ? 1 : 0) +
        `:::dialogue{${attrs}}\n`.length;
      const contentEnd = contentStart + DEFAULT_CONTENT.length;

      dispatch(setContent({ value: newText, isUserInput: false }));
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(contentStart, contentEnd);
      }, 100);
    },
    [content, dispatch]
  );

  const handleSubmit = useCallback(
    (name: string, index: number | null) => {
      if (index === null) {
        setSpeakers(prev => [...prev, { name, avatars: [] }]);
      } else {
        const oldName = speakers[index].name;
        if (oldName === name) return;

        setSpeakers(prev =>
          prev.map((s, i) => (i === index ? { ...s, name } : s))
        );

        const pattern = new RegExp(
          `(:::dialogue\\{[^}]*speaker=")${oldName}("[^}]*\\})`,
          'g'
        );
        dispatch(
          setContent({
            value: content.replace(pattern, `$1${name}$2`),
            isUserInput: false,
          })
        );
      }
    },
    [content, dispatch, speakers]
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        hidden
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleAvatarUpload(file);
          e.target.value = '';
        }}
      />

      <div
        className={clsx(
          'flex items-center gap-2 px-3 py-1.5 border-gray-200 overflow-x-auto',
          shouldAttachToolbarToBottom
            ? 'fixed inset-x-0 z-50 w-screen top-full bg-white/80 backdrop-blur-md translate-y-(--toolbar-translate-y)'
            : 'border-t border-x',
          !isSpeakerPanelOpen && 'hidden'
        )}
        style={{
          '--toolbar-translate-y': toolbarTranslateY,
        }}
      >
        {shouldAttachToolbarToBottom && (
          <button
            onMouseDown={e => e.preventDefault()}
            onTouchStart={e => e.preventDefault()}
            onClick={() => setIsSpeakerPanelOpen(false)}
            className='p-2 -m-2 flex items-center justify-center rounded-full shrink-0'
          >
            <ChevronLeft className='w-5 h-5 text-gray-400' />
          </button>
        )}

        {speakers.map((speaker, speakerIndex) => (
          <div
            key={speakerIndex}
            className='flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full shrink-0'
          >
            <button
              onClick={() => {
                setEditingSpeakerIndex(speakerIndex);
                setIsDialogOpen(true);
              }}
              className='text-sm hover:text-blue-600 hover:cursor-pointer'
            >
              {speaker.name}
            </button>

            <div className='flex gap-1'>
              {speaker.avatars.length > 0 ? (
                speaker.avatars.map((avatar, avatarIndex) => (
                  <button
                    key={avatarIndex}
                    onClick={() =>
                      avatar.status === 'done' &&
                      insertDialogue(speaker.name, avatar.url)
                    }
                    disabled={avatar.status === 'loading'}
                    className='w-7 h-7 relative rounded-full overflow-hidden bg-gray-100 border-2 border-transparent hover:border-blue-500 disabled:hover:border-transparent'
                  >
                    <Image
                      src={avatar.url}
                      alt=''
                      width={28}
                      height={28}
                      className='w-full h-full object-cover'
                    />

                    {avatar.status === 'loading' && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                        <Loader2
                          size={18}
                          strokeWidth={2}
                          className='animate-spin text-white'
                        />
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <button
                  onClick={() => insertDialogue(speaker.name)}
                  className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-transparent hover:border-blue-500',
                    colors[getColorIndex(speaker.name)]
                  )}
                >
                  {speaker.name.charAt(0).toUpperCase()}
                </button>
              )}
            </div>

            <button
              onClick={() => {
                uploadTargetIndexRef.current = speakerIndex;
                fileInputRef.current?.click();
              }}
              className='w-7 h-7 rounded-full border border-dashed border-gray-400 flex items-center justify-center text-gray-400 hover:border-gray-600 hover:text-gray-600'
            >
              <Plus className='w-3 h-3' />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            setEditingSpeakerIndex(null);
            setIsDialogOpen(true);
          }}
          className={clsx(
            'w-7 h-7 flex items-center justify-center rounded-full shrink-0',
            'border border-dashed border-gray-400 text-gray-400 hover:border-gray-600 hover:text-gray-600'
          )}
        >
          <Plus className='w-3 h-3' />
        </button>
      </div>

      <SpeakerSettingsDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        editingSpeakerIndex={editingSpeakerIndex}
        initialName={
          editingSpeakerIndex !== null ? speakers[editingSpeakerIndex].name : ''
        }
        onSubmit={handleSubmit}
      />
    </>
  );
}
