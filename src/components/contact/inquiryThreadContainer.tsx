'use client';

import InquiryImageDialog from '@/components/contact/inquiryImageDialog';
import { INQUIRY_MAX_IMAGES } from '@/features/inquiry/constants/inquiry';
import useImages from '@/features/inquiry/domain/hooks/useImages';
import type { InquiryImageProps } from '@/features/inquiry/ui/model/inquiryImageProps';
import { InquiryMessageProps } from '@/features/inquiry/ui/model/inquiryMessageProps';
import useMediaQuery, { TOUCH_QUERY } from '@/hooks/useMediaQuery';
import { canTouch } from '@/lib/browser';
import { createRipple } from '@/lib/dom';
import clsx from 'clsx';
import { AlertCircle, ImageIcon, Loader2, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const MESSAGE_INPUT_HEIGHT_PX_MIN = 120;

export default function InquiryThreadContainer({
  draft,
  images,
  messages,
  onDraftChange,
  onImageFilesPicked,
  onImageRemove,
  onSend,
  autoFocus = false,
  isSending = false,
}: {
  draft: string;
  images: InquiryImageProps[];
  messages: InquiryMessageProps[];
  onDraftChange: (draft: string) => void;
  onImageFilesPicked: (files: File[]) => void;
  onImageRemove: (img: InquiryImageProps) => void;
  onSend: () => void;
  autoFocus?: boolean;
  isSending?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageInputRef = useRef<HTMLDivElement | null>(null);

  const [messageInputHeightPx, setMessageInputHeightPx] = useState(
    MESSAGE_INPUT_HEIGHT_PX_MIN
  );
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const isTouch = useMediaQuery(TOUCH_QUERY);

  const hasReadyImage = useMemo(
    () => images.some(img => img.status === 'ready'),
    [images]
  );

  const hasBlockingImage = useMemo(
    () =>
      images.some(img => img.status === 'uploading' || img.status === 'error'),
    [images]
  );

  const isInputValid = useMemo(
    () => draft.trim().length > 0 || hasReadyImage,
    [draft, hasReadyImage]
  );

  const canSend = useMemo(
    () => isInputValid && !hasBlockingImage && !isSending,
    [hasBlockingImage, isInputValid, isSending]
  );

  const canAddMoreImages = useMemo(
    () => images.length < INQUIRY_MAX_IMAGES,
    [images]
  );

  const {
    handleFileInputChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handlePaste,
  } = useImages({
    images,
    isFileDragOver,
    canAddMoreImages,
    setIsFileDragOver,
    onImageFilesPicked,
  });

  const sendMessage = () => {
    if (!canSend) return;
    onSend();
  };

  useLayoutEffect(() => {
    const el = messageInputRef.current;
    if (!el) return;

    const apply = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      setMessageInputHeightPx(Math.max(h, MESSAGE_INPUT_HEIGHT_PX_MIN));
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!autoFocus) return;
    textareaRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!imagePreview) return;
    const stillAttached = images.some(
      img => img.status === 'ready' && img.url === imagePreview.src
    );
    if (!stillAttached) setImagePreview(null);
  }, [images, imagePreview]);

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        className='hidden'
        onChange={handleFileInputChange}
      />

      <div
        className={clsx('pt-4', 'pb-(--message-input-height)')}
        style={{ '--message-input-height': `${messageInputHeightPx}px` }}
      >
        <ul className='flex flex-col gap-3 list-none p-0 m-0' role='list'>
          {messages.map((msg, index) => {
            return (
              <li key={msg.id} className='w-full'>
                {msg.showDate && (
                  <div
                    className={clsx(
                      'flex justify-center my-5',
                      index === 0 && 'mt-0'
                    )}
                  >
                    <span className='text-[11px] font-medium text-gray-400 tracking-wide'>
                      {msg.dateLabel}
                    </span>
                  </div>
                )}

                <InquiryMessage
                  content={msg.content}
                  showTime={msg.showTime}
                  timeLabel={msg.timeLabel}
                  isUser={msg.senderType === 'USER'}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div
        ref={messageInputRef}
        className='fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white'
      >
        <div
          className={clsx(
            'px-6 md:px-12 xl:px-18',
            'xl:ml-(--sidebar-width)',
            'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
          )}
        >
          <div className='flex gap-3 items-end py-4'>
            <button
              type='button'
              onMouseDown={e => e.preventDefault()}
              onClick={e => {
                if (canTouch) createRipple(e);

                if (!canAddMoreImages) return;
                fileInputRef.current?.click();
              }}
              disabled={!canAddMoreImages}
              aria-label='이미지 추가'
              className={clsx(
                'shrink-0 flex h-11 w-11 -m-1 -ml-3 p-1 items-center justify-center rounded-full',
                'text-gray-600 hover:text-gray-500 hover:bg-gray-100 cursor-pointer',
                'disabled:pointer-events-none disabled:opacity-50'
              )}
            >
              <ImageIcon size={20} aria-hidden />
            </button>

            <div
              className={clsx(
                'flex flex-col gap-3 flex-1 min-w-0 p-3',
                'rounded-lg border border-gray-200 hover:border-blue-500 focus-within:border-blue-500',
                !isInputValid && 'bg-gray-50',
                isFileDragOver &&
                  'border-blue-500 bg-blue-50/50 ring-2 ring-blue-200'
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {images.length > 0 && (
                <div className='flex gap-2 overflow-x-auto scrollbar-hide'>
                  {images.map((img, index) => (
                    <div
                      key={img.clientId}
                      className='group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50'
                    >
                      {img.status === 'ready' ? (
                        <button
                          type='button'
                          aria-label={`첨부 이미지 ${index + 1} 크게 보기`}
                          className='block h-full w-full cursor-zoom-in border-0 bg-transparent p-0'
                          onClick={() =>
                            setImagePreview({
                              src: img.url,
                              alt: `첨부된 이미지 ${index + 1}`,
                            })
                          }
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={`첨부된 이미지 ${index + 1}`}
                            className='pointer-events-none h-full w-full object-cover'
                            draggable={false}
                          />
                        </button>
                      ) : (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element*/}
                          <img
                            src={img.previewUrl}
                            alt={`첨부된 이미지 ${index + 1}`}
                            className='h-full w-full object-cover opacity-60 blur-[1px]'
                            draggable={false}
                            aria-busy={img.status === 'uploading'}
                          />
                          <div className='absolute inset-0 flex items-center justify-center bg-black/25'>
                            {img.status === 'uploading' ? (
                              <Loader2
                                size={22}
                                className='animate-spin text-white'
                                aria-hidden
                              />
                            ) : (
                              <AlertCircle
                                size={22}
                                className='text-white'
                                aria-hidden
                              />
                            )}
                          </div>
                        </>
                      )}
                      <button
                        type='button'
                        aria-label='첨부 이미지 제거'
                        onMouseDown={e => e.preventDefault()}
                        onClick={e => {
                          e.stopPropagation();
                          onImageRemove(img);
                        }}
                        className={clsx(
                          'h-5 w-5 absolute top-0.5 right-0.5 z-10',
                          'flex items-center justify-center',
                          'rounded-full bg-black/70 text-white hover:bg-black cursor-pointer',
                          !isTouch && img.status !== 'error' && 'hidden',
                          !isTouch &&
                            img.status === 'ready' &&
                            'group-hover:flex'
                        )}
                      >
                        <X size={12} strokeWidth={2.5} aria-hidden />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={draft}
                onChange={e => onDraftChange(e.target.value)}
                onPaste={handlePaste}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
                onKeyDown={e => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key !== 'Enter' || e.shiftKey) return;
                  e.preventDefault();
                  sendMessage();
                }}
                placeholder='메시지를 입력하세요'
                rows={1}
                aria-label='문의 메시지 입력'
                className={clsx(
                  'max-h-52 overflow-y-auto outline-none resize-none scrollbar-hide'
                )}
              />
            </div>

            <button
              type='button'
              onMouseDown={e => e.preventDefault()}
              onClick={sendMessage}
              disabled={!canSend}
              aria-label='문의 보내기'
              className={clsx(
                'shrink-0 text-sm font-medium text-white px-4 rounded-full',
                'h-9 flex items-center justify-center bg-blue-600',
                canSend ? 'hover:bg-blue-500 cursor-pointer' : 'opacity-50'
              )}
            >
              {isSending ? (
                <Loader2 size={16} className='animate-spin' aria-hidden />
              ) : (
                '보내기'
              )}
            </button>
          </div>
        </div>
      </div>

      <InquiryImageDialog
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />
    </>
  );
}

function InquiryMessage({
  content,
  showTime,
  timeLabel,
  isUser,
}: {
  content: string;
  showTime: boolean;
  timeLabel: string;
  isUser: boolean;
}) {
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
            'flex max-w-[min(100%,85%)] items-end gap-2',
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
      </div>
    </div>
  );
}
