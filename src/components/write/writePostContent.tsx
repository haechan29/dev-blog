'use client';

import ImageDropzone from '@/components/image/ImageDropzone';
import SpeakerPanel from '@/components/write/speakerPanel';
import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import useBgmController from '@/features/post/hooks/useBgmController';
import { parseDirectiveRanges } from '@/features/write/domain/lib/contentButton';
import { useEffect, useRef, useState } from 'react';

export default function WritePostContent() {
  const [isSpeakerPanelOpen, setIsSpeakerPanelOpen] = useState(false);
  const [hasPanelAutoOpened, setHasPanelAutoOpened] = useState(false);
  const isScrollSyncPausedRef = useRef(false);

  useBgmController();

  useEffect(() => {
    const onSelectionChange = () => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;
      if (document.activeElement !== contentEditor) return;

      const { selectionStart, selectionEnd } = contentEditor;
      const ranges = parseDirectiveRanges(contentEditor.value, 'dialogue');
      const isInDialogue = ranges.some(
        ([start, end]) => selectionStart >= start && selectionEnd <= end
      );

      if (isInDialogue && !hasPanelAutoOpened) {
        setIsSpeakerPanelOpen(true);
        setHasPanelAutoOpened(true);
      }
      if (!isInDialogue) {
        setHasPanelAutoOpened(false);
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', onSelectionChange);
  }, [hasPanelAutoOpened]);

  return (
    <ImageDropzone isScrollSyncPausedRef={isScrollSyncPausedRef}>
      <div className='h-full grid max-lg:grid-rows-[calc(50%-0.5rem)_calc(50%-0.5rem)] lg:grid-cols-2 gap-4'>
        <div className='h-full flex flex-col max-lg:min-w-0 lg:min-h-0'>
          <WritePostContentToolbar
            isSpeakerPanelOpen={isSpeakerPanelOpen}
            setIsSpeakerPanelOpen={setIsSpeakerPanelOpen}
            isScrollSyncPausedRef={isScrollSyncPausedRef}
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
          <WritePostContentPreview
            isScrollSyncPausedRef={isScrollSyncPausedRef}
          />
        </div>
      </div>
    </ImageDropzone>
  );
}
