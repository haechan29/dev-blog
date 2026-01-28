'use client';

import { colors, getColorIndex, ringColors, textColors } from '@/lib/color';
import clsx from 'clsx';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';

function isValidImageSrc(src: string) {
  return src.startsWith('/') || src.startsWith('http');
}

export default function Dialogue({
  'data-speaker': speaker,
  'data-avatar': avatar,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
  children,
}: {
  'data-speaker': string;
  'data-avatar'?: string;
  'data-start-offset': number;
  'data-end-offset': number;
  children?: ReactNode;
}) {
  const [isError, setIsError] = useState(false);
  const initial = speaker.charAt(0).toUpperCase();
  const color = colors[getColorIndex(speaker)];
  const showImage = avatar && isValidImageSrc(avatar) && !isError;

  useEffect(() => {
    setIsError(false);
  }, [avatar]);

  return (
    <div
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      className='my-4 flex gap-3'
    >
      {showImage ? (
        <Image
          src={avatar}
          alt={speaker}
          width={32}
          height={32}
          onError={() => setIsError(true)}
          className={clsx(
            'w-8 h-8 rounded-full object-cover shrink-0 ring-2',
            ringColors[getColorIndex(speaker)]
          )}
        />
      ) : (
        <div
          className={clsx(
            'w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-medium',
            color
          )}
        >
          {initial}
        </div>
      )}

      <div className='flex-1'>
        <div
          className={clsx(
            'text-xs font-medium',
            textColors[getColorIndex(speaker)]
          )}
        >
          {speaker}
        </div>
        <div className='text-gray-900'>{children}</div>
      </div>
    </div>
  );
}
