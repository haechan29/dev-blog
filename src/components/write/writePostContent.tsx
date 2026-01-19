'use client';

import SpeakerPanel from '@/components/write/speakerPanel';
import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import useBgmController from '@/features/post/hooks/useBgmController';
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
