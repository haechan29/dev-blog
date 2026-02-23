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

export default function Dialogue({ node }: NodeViewProps) {
  const { speaker, avatar } = node.attrs;
  const [isImageError, setIsImageError] = useState(false);

  const initial = speaker?.charAt(0)?.toUpperCase() || '?';
  const colorIndex = getColorIndex(speaker || '');
  const showImage = avatar && isValidImageSrc(avatar) && !isImageError;

  useEffect(() => {
    setIsImageError(false);
  }, [avatar]);

  return (
    <NodeViewWrapper className='not-prose my-4 flex gap-3'>
      {showImage ? (
        <Image
          src={buildImageUrl(avatar, '120')}
          alt={speaker}
          width={32}
          height={32}
          onError={() => setIsImageError(true)}
          className={clsx(
            ringColors[colorIndex],
            'w-8 h-8 rounded-full! m-0! object-cover shrink-0 ring-2'
          )}
        />
      ) : (
        <div
          className={clsx(
            colors[colorIndex],
            'w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-medium'
          )}
        >
          {initial}
        </div>
      )}

      <div className='flex-1'>
        <div className={clsx('text-xs font-medium', textColors[colorIndex])}>
          {speaker}
        </div>

        <NodeViewContent className='text-gray-900' />
      </div>
    </NodeViewWrapper>
  );
}
