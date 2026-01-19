'use client';

import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import useBgmController from '@/features/post/hooks/useBgmController';
import useContentToolbar from '@/features/write/hooks/useContentToolbar';
import clsx from 'clsx';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export default function WritePostContent() {
  const [isSpeakerPanelOpen, setIsSpeakerPanelOpen] = useState(true);

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatars, setNewAvatars] = useState<string[]>([]);

  const addSpeaker = () => {
    if (!newName.trim()) return;
    setSpeakers([...speakers, { name: newName.trim(), avatars: newAvatars }]);
    setNewName('');
    setNewAvatars([]);
    setIsAddDialogOpen(false);
  };

  const addNewAvatar = (file: File) => {
    const url = URL.createObjectURL(file);
    setNewAvatars([...newAvatars, url]);
  };

  const removeNewAvatar = (index: number) => {
    setNewAvatars(newAvatars.filter((_, i) => i !== index));
  };

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

      {isAddDialogOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='bg-white rounded-lg p-4 w-80 space-y-4'>
            <h3 className='font-medium'>화자 추가</h3>

            <div className='space-y-2'>
              <div className='flex flex-wrap gap-2'>
                {newAvatars.map((avatar, index) => (
                  <div key={index} className='relative'>
                    <div className='w-14 h-14 rounded-lg overflow-hidden border border-gray-200'>
                      <img
                        src={avatar}
                        alt=''
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <button
                      onClick={() => removeNewAvatar(index)}
                      className='absolute -top-1 -right-1 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                ))}

                <label className='cursor-pointer'>
                  <div className='w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400'>
                    <Plus className='w-5 h-5 text-gray-400' />
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) addNewAvatar(file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
              <span className='text-xs text-gray-500'>표정별 이미지 추가</span>
            </div>

            <input
              type='text'
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSpeaker()}
              placeholder='화자 이름'
              autoFocus
              className='w-full px-3 py-2 border border-gray-200 rounded'
            />
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewName('');
                  setNewAvatars([]);
                }}
                className='px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded'
              >
                취소
              </button>
              <button
                onClick={addSpeaker}
                className='px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
