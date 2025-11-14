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
  'data-mode': mode,
  alt = '',
}: {
  src: string;
  'data-size': 'medium' | 'large';
  'data-caption': string;
  'data-viewer-caption': string;
  'data-start-offset': string;
  'data-end-offset': string;
  'data-mode': 'preview' | 'reader' | 'viewer';
  alt?: string;
}) {
  const [isError, setIsError] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);

  useEffect(() => {
    setCaptions(JSON.parse(caption));
  }, [caption]);

  useEffect(() => setIsError(false), [src]);

  return isError ? (
    <div
      className='flex items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700 m-4'
      aria-label='이미지를 불러올 수 없습니다'
    >
      {'이미지를 불러올 수 없습니다'}
    </div>
  ) : mode === 'viewer' ? (
    <Image
      data-image-with-caption
      data-caption={caption}
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      src={src}
      alt={alt}
      width={1000}
      height={1000}
      onError={() => setIsError(true)}
      onLoad={() => setIsError(false)}
      className='w-full h-full object-contain'
    />
  ) : (
    <div
      data-image-with-caption
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      data-size={size}
      className='flex flex-col gap-4'
    >
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

      <div className='flex flex-col'>
        {captions.map((caption, index) => (
          <div key={index}>{caption}</div>
        ))}
      </div>
    </div>
  );
}
