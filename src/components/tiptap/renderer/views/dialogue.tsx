'use client';

import { buildImageUrl } from '@/features/media/domain/lib/url';
import { colors, getColorIndex, ringColors, textColors } from '@/lib/color';
import clsx from 'clsx';
import Image from 'next/image';
import { ReactNode, useState } from 'react';

function isValidImageSrc(src: string) {
  return src.startsWith('/') || src.startsWith('http');
}

export default function Dialogue({
  speaker,
  avatar,
  children,
}: {
  speaker: string;
  avatar?: string;
  children?: ReactNode;
}) {
  const [isError, setIsError] = useState(false);
  const initial = speaker?.charAt(0)?.toUpperCase() || '?';
  const colorIndex = getColorIndex(speaker || '');
  const showImage = avatar && isValidImageSrc(avatar) && !isError;

  return (
    <div className='my-4 flex gap-3'>
      {showImage ? (
        <Image
          src={buildImageUrl(avatar, '120')}
          alt={speaker}
          width={32}
          height={32}
          onError={() => setIsError(true)}
          className={clsx(
            ringColors[colorIndex],
            'w-8 h-8 rounded-full object-cover shrink-0 ring-2'
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
        <div className='text-gray-900'>{children}</div>
      </div>
    </div>
  );
}
