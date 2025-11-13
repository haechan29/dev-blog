'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ImageWithCaption({
  src,
  'data-size': size,
  'data-caption': caption,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
  alt = '',
}: {
  src: string;
  'data-size': 'medium' | 'large';
  'data-caption': string;
  'data-start-offset': string;
  'data-end-offset': string;
  alt?: string;
}) {
  const [isError, setIsError] = useState(false);
  const newCaptions = caption
    .replace(/\\#/g, '__ESCAPED_HASH__')
    .replace(/#/g, '')
    .replace(/__ESCAPED_HASH__/g, '#')
    .split('\n');

  useEffect(() => setIsError(false), [src]);

  return (
    <div
      data-image-with-caption
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      data-size={size}
      className='flex flex-col gap-4'
    >
      {isError ? (
        <div
          className='flex items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700 m-4'
          aria-label='이미지를 불러올 수 없습니다'
        >
          {'이미지를 불러올 수 없습니다'}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1000}
          onError={() => setIsError(true)}
          onLoad={() => setIsError(false)}
          className={clsx(
            'h-auto',
            size === 'large' ? 'w-full' : 'min-w-56 w-1/2'
          )}
        />
      )}
      <div data-caption className='flex flex-col'>
        {newCaptions.map((caption, index) => (
          <div key={index}>{caption}</div>
        ))}
      </div>
    </div>
  );
}
