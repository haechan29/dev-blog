'use client';

import type { InquiryMessageDto } from '@/features/inquiry/data/dto/inquiryMessageDto';
import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const MOCK_MESSAGES_BY_THREAD: Record<string, InquiryMessageDto[]> = {
  'mock-thread-1': [
    {
      id: 'mock-msg-1',
      senderType: 'USER',
      createdAt: '2026-04-01T10:00:00.000Z',
      content: '결제 내역이 이상하게 보여서 문의드립니다.',
      imageUrls: [],
    },
    {
      id: 'mock-msg-1b',
      senderType: 'USER',
      createdAt: '2026-04-01T10:00:45.000Z',
      content: '스크린샷도 함께 첨부했습니다.',
      imageUrls: [],
    },
    {
      id: 'mock-msg-2',
      senderType: 'ADMIN',
      createdAt: '2026-04-05T02:30:00.000Z',
      content:
        '안녕하세요. 주문번호와 결제 시각을 알려주시면 확인해 드리겠습니다.',
      imageUrls: [],
    },
    {
      id: 'mock-msg-2b',
      senderType: 'ADMIN',
      createdAt: '2026-04-05T02:30:00.000Z',
      content: '가능하시면 스크린샷도 함께 부탁드립니다.',
      imageUrls: [],
    },
    {
      id: 'mock-msg-3',
      senderType: 'USER',
      createdAt: '2026-04-06T08:15:00.000Z',
      content: '주문번호 ORD-9981입니다. 감사합니다.',
      imageUrls: [],
    },
  ],
  'mock-thread-2': [
    {
      id: 'mock-msg-3',
      senderType: 'USER',
      createdAt: '2026-03-20T09:00:00.000Z',
      content: '계정 삭제 절차가 궁금합니다.',
      imageUrls: [],
    },
    {
      id: 'mock-msg-4',
      senderType: 'ADMIN',
      createdAt: '2026-03-21T02:00:00.000Z',
      content:
        '설정 > 계정 > 계정 삭제에서 진행하실 수 있습니다. 진행 중 막히는 단계가 있으면 알려주세요.',
      imageUrls: [],
    },
    {
      id: 'mock-msg-4b',
      senderType: 'USER',
      createdAt: '2026-03-21T03:00:00.000Z',
      content: '안내해 주신 대로 진행하면 됩니다. 추가 문의는 언제든 주세요.',
      imageUrls: [],
    },
  ],
  'mock-thread-3': [
    {
      id: 'mock-msg-5',
      senderType: 'USER',
      createdAt: '2026-02-10T08:00:00.000Z',
      content: '이전에 문의드린 건 해결되었습니다.',
      imageUrls: [],
    },
    {
      id: 'mock-msg-6',
      senderType: 'ADMIN',
      createdAt: '2026-02-15T07:00:00.000Z',
      content: '도움이 되었다니 다행입니다. 감사합니다.',
      imageUrls: [],
    },
    {
      id: 'mock-msg-6b',
      senderType: 'USER',
      createdAt: '2026-02-15T07:00:30.000Z',
      content: '감사합니다.',
      imageUrls: [],
    },
  ],
};

function localDateKey(iso: string): string {
  const d = new Date(iso);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function formatDateDivider(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatTimeHm(iso: string): string {
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

/** 고정 툴바 높이와 맞춤: border-t + py-4(상·하) + textarea max-h-52 */
const INQUIRY_COMPOSER_BOTTOM_PADDING = 'pb-[calc(1px+2rem+13rem)]';

const inquiryThreadShellLayout = clsx(
  'px-6 md:px-12 xl:px-18',
  'xl:ml-(--sidebar-width)',
  'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
);

export default function InquiryThreadPageClient({
  inquiryThreadId,
}: {
  inquiryThreadId: string;
}) {
  const [messages, setMessages] = useState<InquiryMessageDto[]>([]);
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const raw = MOCK_MESSAGES_BY_THREAD[inquiryThreadId] ?? [];
    setMessages(
      [...raw].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );
    setDraft('');
  }, [inquiryThreadId]);

  const sendMessage = useCallback(() => {
    const text = draft.trim();
    if (text === '') return;

    const next: InquiryMessageDto = {
      id: `local-${Date.now()}`,
      senderType: 'USER',
      createdAt: new Date().toISOString(),
      content: text,
      imageUrls: [],
    };
    setMessages(prev => [...prev, next]);
    setDraft('');
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.style.height = 'auto';
      }
    });
  }, [draft]);

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
              메시지가 없거나 찾을 수 없는 문의입니다.
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
                          {formatDateDivider(msg.createdAt)}
                        </span>
                      </div>
                    )}

                    <MessageRow
                      content={msg.content}
                      showTime={showTime}
                      timeLabel={formatTimeHm(msg.createdAt)}
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
                onChange={e => setDraft(e.target.value)}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
                onKeyDown={e => {
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
                  !draft && 'bg-gray-50'
                )}
              />
              <button
                type='button'
                onMouseDown={e => e.preventDefault()}
                onClick={sendMessage}
                disabled={draft.trim() === ''}
                className={clsx(
                  'shrink-0 text-sm font-medium text-white px-4 rounded-full',
                  'h-9 flex items-center justify-center bg-blue-600',
                  draft.trim() !== ''
                    ? 'hover:bg-blue-500 cursor-pointer'
                    : 'opacity-50'
                )}
              >
                보내기
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
