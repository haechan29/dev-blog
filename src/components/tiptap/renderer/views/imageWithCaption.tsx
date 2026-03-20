'use client';

import { buildImageUrl } from '@/features/media/domain/lib/url';
import clsx from 'clsx';
import { useState } from 'react';

function ErrorImage() {
  return (
    <div className='flex items-center justify-center p-4 rounded-sm bg-gray-200 text-gray-700'>
      이미지를 불러올 수 없습니다
    </div>
  );
}

export default function ImageWithCaption({
  src,
  alt,
  size = 'medium',
}: {
  src: string;
  alt?: string;
  size?: 'medium' | 'large';
}) {
  const [isError, setIsError] = useState(false);

  const imageSize = clsx(
    'h-auto',
    size === 'large' ? 'w-full' : 'w-[60%] min-w-[min(480px,100%)]'
  );

  return (
    <figure
      data-image-with-caption
      className='flex flex-col items-center gap-1'
    >
      {isError || !src ? (
        <ErrorImage />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={buildImageUrl(src, '1200')}
          srcSet={`${buildImageUrl(src, '800')} 800w, ${buildImageUrl(src, '1200')} 1200w, ${buildImageUrl(src, 'original')} 1920w`}
          sizes={
            size === 'large'
              ? '(min-width: 896px) 896px, 100vw'
              : '(min-width: 768px) 480px, 100vw'
          }
          alt={alt || ''}
          width={1000}
          height={1000}
          decoding='async'
          loading='lazy'
          onError={() => setIsError(true)}
          onLoad={() => setIsError(false)}
          className={imageSize}
        />
      )}

      {alt && (
        <figcaption className='text-center text-sm text-gray-600'>
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
