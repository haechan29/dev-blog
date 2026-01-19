'use client';

import AddSpeakerDialog from '@/components/write/addSpeakerDialog';
import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import useBgmController from '@/features/post/hooks/useBgmController';
import useContentToolbar from '@/features/write/hooks/useContentToolbar';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function WritePostContent() {
  const [isSpeakerPanelOpen, setIsSpeakerPanelOpen] = useState(false);

  useBgmController();

  return (
    <div className='h-full grid max-lg:grid-rows-[calc(50%-0.5rem)_calc(50%-0.5rem)] lg:grid-cols-2 gap-4'>
      <div className='h-full flex flex-col max-lg:min-w-0 lg:min-h-0'>
        <WritePostContentToolbar
          isSpeakerPanelOpen={isSpeakerPanelOpen}
          setIsSpeakerPanelOpen={setIsSpeakerPanelOpen}
        />
        <SpeakerPanel
          isSpeakerPanelOpen={isSpeakerPanelOpen}
          setIsSpeakerPanelOpen={setIsSpeakerPanelOpen}
        />
        <div className='flex-1 min-h-0'>
          <WritePostContentEditor />
        </div>
      </div>

      <div className='max-lg:min-w-0 lg:min-h-0'>
        <WritePostContentPreview />
      </div>
    </div>
  );
}

function SpeakerPanel({
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
      avatars: ['https://api.dicebear.com/9.x/personas/svg?seed=guest1'],
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(true);

  return (
    <>
      <div
        className={clsx(
          'flex flex-wrap items-center gap-2 px-3 py-2 border-gray-200',
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
            className='flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full'
          >
            <span className='text-sm mr-1'>{speaker.name}</span>
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
                    className='w-7 h-7 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500'
                  >
                    <img
                      src={avatar}
                      alt=''
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))
              ) : (
                <button
                  onClick={() => {
                    console.log(`삽입: ${speaker.name}, no avatar`);
                  }}
                  className='w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs border-2 border-transparent hover:border-blue-500'
                >
                  {speaker.name[0]}
                </button>
              )}
              <button
                onClick={() => {
                  console.log(`표정 추가: ${speaker.name}`);
                }}
                className='w-7 h-7 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600'
              >
                <Plus className='w-3 h-3' />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setIsAddDialogOpen(true)}
          className='w-8 h-8 flex items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600'
        >
          <Plus className='w-4 h-4' />
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
