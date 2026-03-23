'use client';

import DialogueSettingsDialog from '@/components/write/dialogueSettingsDialog';
import { ApiError } from '@/errors/errors';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { buildImageUrl } from '@/features/media/domain/lib/url';
import { colors, getColorIndex } from '@/lib/color';
import { Editor } from '@tiptap/react';
import imageCompression from 'browser-image-compression';
import clsx from 'clsx';
import { Loader2, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SimpleBar from 'simplebar-react';

interface Avatar {
  url: string;
  status: 'loading' | 'done';
}

interface Speaker {
  name: string;
  avatars: Avatar[];
}

export default function DialogueToolbar({
  editor,
  isOpen,
  setIsOpen,
}: {
  editor: Editor | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
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
            });

      const baseUrl =
        await MediaClientRepository.uploadAvatarImage(compressedFile);

      URL.revokeObjectURL(blobUrl);

      setSpeakers(prev =>
        prev.map((speaker, i) =>
          i === targetIndex
            ? {
                ...speaker,
                avatars: speaker.avatars.map(avatar =>
                  avatar.url === blobUrl
                    ? { url: baseUrl, status: 'done' as const }
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

  const handleSpeakerSelect = useCallback(
    (speaker: string, avatar?: string) => {
      if (!editor) return;

      if (editor.isActive('dialogue')) {
        editor
          .chain()
          .focus()
          .updateAttributes('dialogue', {
            speaker,
            avatar: avatar || '',
          })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .setDialogue({
            speaker,
            avatar: avatar || '',
          })
          .run();
      }
    },
    [editor]
  );

  const handleSpeakerUpdate = useCallback(
    (name: string, index: number | null) => {
      if (!editor) return;

      if (index === null) {
        setSpeakers(prev => [...prev, { name, avatars: [] }]);
      } else {
        const oldName = speakers[index].name;
        if (oldName === name) return;

        setSpeakers(prev =>
          prev.map((s, i) => (i === index ? { ...s, name } : s))
        );

        const { doc } = editor.state;
        doc.descendants((node, pos) => {
          if (node.type.name === 'dialogue' && node.attrs.speaker === oldName) {
            editor
              .chain()
              .setNodeSelection(pos)
              .updateAttributes('dialogue', { speaker: name })
              .run();
          }
        });
      }
    },
    [editor, speakers]
  );

  useEffect(() => {
    if (!editor || !isOpen) return;

    const parsed = parseDialogueSpeakers(editor);
    setSpeakers(parsed);
  }, [editor, isOpen]);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      if (editor.isActive('dialogue')) {
        setIsOpen(true);
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, setIsOpen]);

  if (!editor) return null;

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
          'fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200',
          !isOpen && 'hidden'
        )}
        onMouseDown={e => e.preventDefault()}
        onTouchStart={e => e.preventDefault()}
      >
        <SimpleBar className='simplebar-hover'>
          <div className='flex items-center px-3 py-1.5 gap-2'>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 -m-2 flex items-center justify-center rounded-full shrink-0'
            >
              <X className='w-4 h-4 text-gray-400' />
            </button>

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
                          handleSpeakerSelect(speaker.name, avatar.url)
                        }
                        disabled={avatar.status === 'loading'}
                        className='w-7 h-7 relative rounded-full overflow-hidden bg-gray-100 border-2 border-transparent hover:border-blue-500 disabled:hover:border-transparent'
                      >
                        <Image
                          src={buildImageUrl(avatar.url, '120')}
                          alt={`${speaker.name}의 아바타${avatarIndex + 1}`}
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
                      onClick={() => handleSpeakerSelect(speaker.name)}
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

            <div className='shrink-0 w-px h-px' />
          </div>
        </SimpleBar>
      </div>

      <DialogueSettingsDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        editingSpeakerIndex={editingSpeakerIndex}
        initialName={
          editingSpeakerIndex !== null ? speakers[editingSpeakerIndex].name : ''
        }
        onSpeakerUpdate={handleSpeakerUpdate}
      />
    </>
  );
}

function parseDialogueSpeakers(editor: Editor): Speaker[] {
  const speakerMap = new Map<string, Set<string>>();

  editor.state.doc.descendants(node => {
    if (node.type.name === 'dialogue') {
      const speaker = node.attrs.speaker;
      const avatar = node.attrs.avatar;

      if (speaker) {
        if (!speakerMap.has(speaker)) {
          speakerMap.set(speaker, new Set());
        }
        if (avatar) {
          speakerMap.get(speaker)!.add(avatar);
        }
      }
    }
  });

  return Array.from(speakerMap.entries()).map(([name, avatars]) => ({
    name,
    avatars: Array.from(avatars).map(url => ({ url, status: 'done' as const })),
  }));
}
