'use client';

import { InquiryMessageProps } from '@/features/inquiry/ui/model/inquiryMessageProps';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

const INQUIRY_COMPOSER_BOTTOM_PADDING = 'pb-[calc(1px+2rem+13rem)]';

export default function InquiryThreadContainer({
  draft,
  images,
  messages,
  onDraftChange,
  onSend,
  autoFocus = false,
  isSending = false,
}: {
  draft: string;
  images: string[];
  messages: InquiryMessageProps[];
  onDraftChange: (draft: string) => void;
  onSend: () => void;
  autoFocus?: boolean;
  isSending?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isInputValid = useMemo(
    () => draft.trim().length > 0 || images.length > 0,
    [draft, images]
  );

  const canSend = isInputValid && !isSending;

  useEffect(() => {
    if (!autoFocus) return;
    textareaRef.current?.focus();
  }, [autoFocus]);

  const sendMessage = () => {
    if (!canSend) return;
    onSend();
  };

  return (
    <>
      <div className={clsx('pt-4', INQUIRY_COMPOSER_BOTTOM_PADDING)}>
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

      <div className='fixed inset-x-0 bottom-0 z-100 border-t border-gray-200 bg-white'>
        <div
          className={clsx(
            'px-6 md:px-12 xl:px-18',
            'xl:ml-(--sidebar-width)',
            'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
          )}
        >
          <div className='flex gap-3 items-end py-4'>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={e => onDraftChange(e.target.value)}
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
                'max-h-52 flex-1 min-w-0 overflow-y-auto p-3 outline-none resize-none border rounded-lg scrollbar-hide',
                'border-gray-200 hover:border-blue-500 focus:border-blue-500',
                !isInputValid && 'bg-gray-50'
              )}
            />
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
