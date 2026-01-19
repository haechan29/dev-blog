import { colors, getColorIndex } from '@/lib/color';
import clsx from 'clsx';
import Image from 'next/image';
import { ReactNode } from 'react';

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
  const initial = speaker.charAt(0).toUpperCase();
  const color = colors[getColorIndex(speaker)];

  return (
    <div
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      className='my-4 flex gap-3'
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={speaker}
          width={32}
          height={32}
          className='w-8 h-8 rounded-full object-cover shrink-0'
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
        <div className='text-xs text-gray-500'>{speaker}</div>
        <div className='text-gray-900'>{children}</div>
      </div>
    </div>
  );
}
