'use client';

import { buildImageUrl } from '@/features/media/domain/lib/url';
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
  const showImage = avatar && isValidImageSrc(avatar) && !isError;

  const color = colors[getColorIndex(speaker)];
  const profileSize = 'w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12';
  const textSize = 'text-sm lg:text-base xl:text-lg font-medium';

  useEffect(() => {
    setIsError(false);
  }, [avatar]);

  return (
    <div
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      className='my-4 lg:my-5 xl:my-6 flex gap-3 not-prose'
    >
      {showImage ? (
        <Image
          src={buildImageUrl(avatar, '120')}
          alt={speaker}
          width={32}
          height={32}
          onError={() => setIsError(true)}
          className={clsx(
            profileSize,
            ringColors[getColorIndex(speaker)],
            'rounded-full object-cover shrink-0 ring-2'
          )}
        />
      ) : (
        <div
          className={clsx(
            profileSize,
            textSize,
            color,
            'rounded-full shrink-0 flex items-center justify-center text-white'
          )}
        >
          {initial}
        </div>
      )}

      <div className='flex-1'>
        <div className={clsx(textSize, textColors[getColorIndex(speaker)])}>
          {speaker}
        </div>
        <div className='text-gray-900'>{children}</div>
      </div>
    </div>
  );
}
