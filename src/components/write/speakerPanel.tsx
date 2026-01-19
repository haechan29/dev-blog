'use client';

import AddSpeakerDialog from '@/components/write/addSpeakerDialog';
import { ApiError } from '@/errors/errors';
import * as ImageClientRepository from '@/features/image/data/repository/imageClientRepository';
import useContentToolbar from '@/features/write/hooks/useContentToolbar';
import { colors, getColorIndex } from '@/lib/color';
import imageCompression from 'browser-image-compression';
import clsx from 'clsx';
import { Loader2, Plus } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';

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

  const [speakers, setSpeakers] = useState<Speaker[]>([
    {
      name: '호스트',
      avatars: [
        {
          url: 'https://api.dicebear.com/9.x/personas/svg?seed=host1',
          status: 'done',
        },
        {
          url: 'https://api.dicebear.com/9.x/personas/svg?seed=host2',
          status: 'done',
        },
      ],
    },
    {
      name: '게스트',
      avatars: [],
    },
    {
      name: '임해찬',
      avatars: [
        {
          url: 'https://api.dicebear.com/9.x/personas/svg?seed=host3',
          status: 'done',
        },
        {
          url: 'https://api.dicebear.com/9.x/personas/svg?seed=host4',
          status: 'done',
        },
        {
          url: 'https://api.dicebear.com/9.x/personas/svg?seed=host5',
          status: 'done',
        },
      ],
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
          'flex items-center gap-2 px-3 py-2 border-gray-200 overflow-x-auto',
          shouldAttachToolbarToBottom
            ? 'fixed inset-x-0 z-50 w-screen top-full bg-white/80 backdrop-blur-md translate-y-(--toolbar-translate-y)'
            : 'border-t border-x',
          !isSpeakerPanelOpen && 'hidden'
        )}
        style={{
          '--toolbar-translate-y': toolbarTranslateY,
        }}
      >
        {speakers.map((speaker, speakerIndex) => (
          <div
            key={speakerIndex}
            className='flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full shrink-0'
          >
            <span className='text-sm'>{speaker.name}</span>

            <div className='flex gap-1'>
              {speaker.avatars.length > 0 ? (
                speaker.avatars.map((avatar, avatarIndex) => (
                  <button
                    key={avatarIndex}
                    onClick={() => {
                      console.log(
                        `삽입: ${speaker.name}, avatar ${avatarIndex}`
                      );
                    }}
                    className='w-7 h-7 relative rounded-full overflow-hidden bg-gray-100 border-2 border-transparent hover:border-blue-500'
                  >
                    {/* import Image from 'next/image';
                    <Image
                      src={avatar}
                      alt=''
                      width={28}
                      height={28}
                      className='w-full h-full object-cover'
                    /> */}

                    <img
                      src={avatar.url}
                      alt=''
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
                  onClick={() => {
                    console.log(`삽입: ${speaker.name}, no avatar`);
                  }}
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
          onClick={() => setIsAddDialogOpen(true)}
          className={clsx(
            'w-7 h-7 flex items-center justify-center rounded-full shrink-0',
            'border border-dashed border-gray-400 text-gray-400 hover:border-gray-600 hover:text-gray-600'
          )}
        >
          <Plus className='w-3 h-3' />
        </button>
      </div>

      <AddSpeakerDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAdd={speaker =>
          setSpeakers([...speakers, { ...speaker, avatars: [] }])
        }
      />
    </>
  );
}
