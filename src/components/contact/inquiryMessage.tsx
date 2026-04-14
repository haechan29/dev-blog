'use client';

import clsx from 'clsx';

export default function InquiryMessage({
  content,
  imageUrls,
  showTime,
  timeLabel,
  isUser,
  onImagePreview,
}: {
  content: string;
  imageUrls: string[];
  showTime: boolean;
  timeLabel: string;
  isUser: boolean;
  onImagePreview: (src: string, alt: string) => void;
}) {
  const hasText = content.trim().length > 0;
  const hasImages = imageUrls.length > 0;

  const bubble = (
    <div
      className={clsx(
        'min-w-0 rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug wrap-break-word',
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
      )}
    >
      {content}
    </div>
  );

  const timeEl = showTime && (
    <span className='shrink-0 text-xs text-gray-400 pb-px'>{timeLabel}</span>
  );

  const imageGrid = hasImages && (
    <div
      className={clsx(
        'flex flex-wrap gap-1.5',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {imageUrls.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className='h-32 w-32 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50'
        >
          <button
            type='button'
            aria-label={`메시지 이미지 ${index + 1} 크게 보기`}
            className='block h-full w-full cursor-zoom-in border-0 bg-transparent p-0'
            onClick={() => onImagePreview(url, `메시지 이미지 ${index + 1}`)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`메시지 이미지 ${index + 1}`}
              className='pointer-events-none h-full w-full object-cover'
              draggable={false}
            />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className='flex flex-col gap-1'>
      {!isUser && <div className='text-sm ml-1'>운영자</div>}
      <div
        className={clsx(
          'flex w-full',
          isUser ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={clsx(
            'flex min-w-0 max-w-[min(100%,85%)] flex-col gap-1.5',
            isUser ? 'items-end' : 'items-start'
          )}
        >
          {imageGrid}
          {hasText && (
            <div
              className={clsx(
                'flex w-full items-end gap-2',
                isUser ? 'justify-end' : 'justify-start'
              )}
            >
              {isUser ? (
                <>
                  {timeEl}
                  {bubble}
                </>
              ) : (
                <>
                  {bubble}
                  {timeEl}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
