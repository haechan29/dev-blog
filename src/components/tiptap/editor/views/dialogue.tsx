'use client';

import { buildImageUrl } from '@/features/media/domain/lib/url';
import { colors, getColorIndex, ringColors, textColors } from '@/lib/color';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function isValidImageSrc(src: string) {
  return src.startsWith('/') || src.startsWith('http');
}

export default function Dialogue({ node, updateAttributes }: NodeViewProps) {
  const { speaker, avatar } = node.attrs;
  const [isEditingSpeaker, setIsEditingSpeaker] = useState(false);
  const [speakerInput, setSpeakerInput] = useState(speaker);
  const [isImageError, setIsImageError] = useState(false);

  const initial = speaker?.charAt(0)?.toUpperCase() || '?';
  const colorIndex = getColorIndex(speaker || '');
  const showImage = avatar && isValidImageSrc(avatar) && !isImageError;

  useEffect(() => {
    setIsImageError(false);
  }, [avatar]);

  useEffect(() => {
    setSpeakerInput(speaker);
  }, [speaker]);

  const handleSpeakerSubmit = () => {
    updateAttributes({ speaker: speakerInput });
    setIsEditingSpeaker(false);
  };

  const handleAvatarClick = () => {
    const url = window.prompt('아바타 이미지 URL을 입력하세요:', avatar || '');
    if (url !== null) {
      updateAttributes({ avatar: url });
    }
  };

  return (
    <NodeViewWrapper className='not-prose my-4 flex gap-3'>
      {/* 아바타 */}
      {showImage ? (
        <Image
          src={buildImageUrl(avatar, '120')}
          alt={speaker || '화자'}
          width={32}
          height={32}
          onError={() => setIsImageError(true)}
          onClick={handleAvatarClick}
          className={clsx(
            ringColors[colorIndex],
            'w-8 h-8 rounded-full object-cover shrink-0 ring-2 cursor-pointer'
          )}
        />
      ) : (
        <div
          onClick={handleAvatarClick}
          className={clsx(
            colors[colorIndex],
            'w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-medium cursor-pointer'
          )}
        >
          {initial}
        </div>
      )}

      {/* 화자명 + 대사 */}
      <div className='flex-1'>
        {/* 화자명 */}
        {isEditingSpeaker ? (
          <input
            type='text'
            value={speakerInput}
            onChange={e => setSpeakerInput(e.target.value)}
            onBlur={handleSpeakerSubmit}
            onKeyDown={e => e.key === 'Enter' && handleSpeakerSubmit()}
            autoFocus
            className={clsx(
              'text-xs font-medium bg-transparent border-b outline-none',
              textColors[colorIndex]
            )}
          />
        ) : (
          <div
            onClick={() => setIsEditingSpeaker(true)}
            className={clsx(
              'text-xs font-medium cursor-pointer',
              textColors[colorIndex]
            )}
          >
            {speaker || '화자명 클릭'}
          </div>
        )}

        {/* 대사 내용 */}
        <NodeViewContent className='text-gray-900' />
      </div>
    </NodeViewWrapper>
  );
}
