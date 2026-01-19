'use client';

import AddSpeakerDialog from '@/components/write/addSpeakerDialog';
import useContentToolbar from '@/features/write/hooks/useContentToolbar';
import { colors, getColorIndex } from '@/lib/color';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

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

  const [speakers, setSpeakers] = useState([
    {
      name: '호스트',
      avatars: [
        'https://api.dicebear.com/9.x/personas/svg?seed=host1',
        'https://api.dicebear.com/9.x/personas/svg?seed=host2',
      ],
    },
    {
      name: '게스트',
      avatars: [],
    },
    {
      name: '임해찬',
      avatars: [
        'https://api.dicebear.com/9.x/personas/svg?seed=host3',
        'https://api.dicebear.com/9.x/personas/svg?seed=host4',
        'https://api.dicebear.com/9.x/personas/svg?seed=host5',
      ],
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
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
                    className='w-7 h-7 rounded-full overflow-hidden bg-gray-100 border-2 border-transparent hover:border-blue-500'
                  >
                    <Image
                      src={avatar}
                      alt=''
                      width={28}
                      height={28}
                      className='w-full h-full object-cover'
                    />
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
                console.log(`표정 추가: ${speaker.name}`);
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
        onAdd={speaker => setSpeakers([...speakers, speaker])}
      />
    </>
  );
}
