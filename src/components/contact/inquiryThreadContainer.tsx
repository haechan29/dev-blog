'use client';

import type { InquiryMessageDto } from '@/features/inquiry/data/dto/inquiryMessageDto';
import clsx from 'clsx';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';

function localDateKey(iso: string): string {
  const d = new Date(iso);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function isSameTimeGroup(a: InquiryMessageDto, b: InquiryMessageDto): boolean {
  if (a.senderType !== b.senderType) return false;
  const da = new Date(a.createdAt);
  const db = new Date(b.createdAt);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate() &&
    da.getHours() === db.getHours() &&
    da.getMinutes() === db.getMinutes()
  );
}

function showTimeForMessage(
  messages: InquiryMessageDto[],
  index: number
): boolean {
  const next = messages[index + 1];
  if (!next) return true;
  return !isSameTimeGroup(messages[index], next);
}

const INQUIRY_COMPOSER_BOTTOM_PADDING = 'pb-[calc(1px+2rem+13rem)]';

const inquiryThreadShellLayout = clsx(
  'px-6 md:px-12 xl:px-18',
  'xl:ml-(--sidebar-width)',
  'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
);

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
  messages: InquiryMessageDto[];
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
      <div
        className={clsx('mt-(--toolbar-height) mb-8', inquiryThreadShellLayout)}
      >
        <div
          className={clsx(
            'flex flex-col pt-8 max-w-2xl mx-auto w-full',
            INQUIRY_COMPOSER_BOTTOM_PADDING
          )}
        >
          <div className='mb-6'>
            <Link
              href='/contact'
              className='inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors'
            >
              <ChevronLeft className='w-4 h-4' aria-hidden />
              문의 목록으로
            </Link>
          </div>

          <h1 className='text-lg font-semibold text-gray-900 mb-6'>
            문의 상세
          </h1>

          {messages.length === 0 ? (
            <p className='text-center py-16 text-gray-500'>
              문의 내용을 입력해 주세요.
            </p>
          ) : (
            <ul className='flex flex-col gap-3 list-none p-0 m-0' role='list'>
              {messages.map((msg, index) => {
                const showDate =
                  index === 0 ||
                  localDateKey(msg.createdAt) !==
                    localDateKey(messages[index - 1].createdAt);
                const showTime = showTimeForMessage(messages, index);
                const isUser = msg.senderType === 'USER';

                return (
                  <li key={msg.id} className='w-full'>
                    {showDate && (
                      <div
                        className={clsx(
                          'flex justify-center my-5',
                          index === 0 && 'mt-0'
                        )}
                      >
                        <span className='text-[11px] font-medium text-gray-400 tracking-wide'>
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                    )}

                    <MessageRow
                      content={msg.content}
                      showTime={showTime}
                      timeLabel={formatTime(msg.createdAt)}
                      isUser={isUser}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className='fixed inset-x-0 bottom-0 z-100 border-t border-gray-200 bg-white'>
        <div className={inquiryThreadShellLayout}>
          <div className='max-w-2xl mx-auto w-full'>
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
                aria-label={'문의 보내기'}
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
      </div>
    </>
  );
}

function MessageRow({
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

  const timeEl = showTime === true && (
    <span className='shrink-0 text-[11px] tabular-nums leading-none text-gray-400 pb-px'>
      {timeLabel}
    </span>
  );

  return (
    <div
      className={clsx('flex w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={clsx(
          'flex max-w-[min(100%,85%)] flex-row items-end gap-2',
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
  );
}
