'use client';

import { CreatorSettingsDropdown } from '@/components/creator/creatorSettingsDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Creator,
  CREATOR_STATUS_CONFIG,
} from '@/features/creator/domain/model/creator';
import { CreatorStatus } from '@/features/creator/domain/type/creatorStatus';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';
import { formatDateBrief, formatRelativeTime } from '@/lib/date';
import clsx from 'clsx';
import { ChevronRight, MoreVertical, RefreshCw } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function CreatorDetail({
  creator,
  emails,
  isEmailsLoading,
  onSendEmail,
  onSync,
  isSyncing,
  lastSyncedAt,
  onEdit,
  onDelete,
  onStatusChange,
  onMarkAsRead,
}: {
  creator: Creator | null;
  emails: OutreachEmail[];
  isEmailsLoading: boolean;
  onSendEmail: () => void;
  onSync: () => void;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: CreatorStatus) => void;
  onMarkAsRead: (emailId: string, creatorId: string) => void;
}) {
  const [openEmailId, setOpenEmailId] = useState<string | null>(null);
  const onChannelNameClick = async () => {
    if (!creator) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        `https://sharetext.app/api/invite/${creator.id}`
      );
      toast.success('복사되었습니다');
    } catch {
      toast.error('복사에 실패했습니다');
    }
  };

  useEffect(() => {
    const firstEmail = emails[0];
    setOpenEmailId(firstEmail?.id ?? null);

    if (
      firstEmail &&
      !firstEmail.isRead &&
      firstEmail.direction === 'received'
    ) {
      onMarkAsRead(firstEmail.id, firstEmail.creatorId);
    }
  }, [emails, onMarkAsRead]);

  if (!creator) {
    return (
      <main className='flex-1 min-w-0 ml-(--sidebar-width) flex items-center justify-center text-gray-400'>
        크리에이터를 선택해주세요
      </main>
    );
  }

  return (
    <main className='flex-1 min-w-0 ml-(--sidebar-width) flex flex-col'>
      <section className='sticky top-0 bg-white/80 backdrop-blur-md p-4'>
        <div className='flex items-center gap-3 mb-2'>
          <button
            onClick={onChannelNameClick}
            className='hover:opacity-60 cursor-pointer'
          >
            <h2 className='text-xl font-bold'>{creator.channelName}</h2>
          </button>
          <StatusDropdown onStatusChange={onStatusChange}>
            <button
              className={clsx(
                'text-xs px-2 py-0.5 rounded cursor-pointer',
                CREATOR_STATUS_CONFIG[creator.status].color
              )}
            >
              {CREATOR_STATUS_CONFIG[creator.status].label}
            </button>
          </StatusDropdown>
          <div className='flex-1' />
          <button
            onClick={onSendEmail}
            className='px-3 py-1.5 text-sm bg-blue-500 text-white font-semibold rounded hover:bg-blue-400 cursor-pointer'
          >
            메일 작성
          </button>
          <CreatorSettingsDropdown onEdit={onEdit} onDelete={onDelete}>
            <button className='p-2 hover:bg-gray-100 rounded-full cursor-pointer'>
              <MoreVertical className='w-5 h-5 text-gray-500' />
            </button>
          </CreatorSettingsDropdown>
        </div>
        {creator.memo && (
          <div className='text-sm text-gray-600 whitespace-pre-wrap'>
            {creator.memo}
          </div>
        )}
      </section>

      <section className='flex-1 p-4'>
        <div className='flex items-center gap-2 mb-2'>
          <h3 className='font-semibold'>이메일 히스토리</h3>

          <div className='flex items-center gap-1'>
            <button
              onClick={onSync}
              disabled={isSyncing}
              className='p-1 hover:bg-gray-100 rounded disabled:opacity-50'
            >
              <RefreshCw
                className={clsx(
                  'w-4 h-4 text-gray-500',
                  isSyncing && 'animate-spin'
                )}
              />
            </button>

            {lastSyncedAt && (
              <span className='text-xs text-gray-400'>
                마지막 갱신: {formatRelativeTime(lastSyncedAt)}
              </span>
            )}
          </div>
        </div>

        {isEmailsLoading ? (
          <></>
        ) : emails.length === 0 ? (
          <div className='py-20 text-center text-gray-400'>
            발송된 이메일이 없습니다
          </div>
        ) : (
          <ul>
            {emails.map((email, index) => (
              <EmailTimelineItem
                key={email.id}
                email={email}
                isFirst={index === 0}
                isLast={index === emails.length - 1}
                isOpen={openEmailId === email.id}
                onToggle={() =>
                  setOpenEmailId(openEmailId === email.id ? null : email.id)
                }
                onMarkAsRead={() => onMarkAsRead(email.id, email.creatorId)}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function EmailTimelineItem({
  email,
  isFirst,
  isLast,
  isOpen,
  onToggle,
  onMarkAsRead,
}: {
  email: OutreachEmail;
  isFirst: boolean;
  isLast: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onMarkAsRead: () => void;
}) {
  const isSent = email.direction === 'sent';

  return (
    <li className='flex gap-3 group'>
      <div className='w-20 text-xs text-gray-500 text-right pt-0.5 shrink-0'>
        <div>{formatDateBrief(email.sentAt)}</div>
        <div className={clsx(!isSent && 'text-blue-600 font-medium')}>
          {isSent ? '보냄' : '받음'}
        </div>
      </div>

      <div className='flex flex-col items-center'>
        <div className={clsx('w-px h-2 bg-gray-200', isFirst && 'invisible')} />
        <div
          className={clsx(
            'w-2 h-2 rounded-full shrink-0',
            isSent ? 'bg-gray-300' : 'bg-blue-500'
          )}
        />
        <div
          className={clsx('w-px flex-1 bg-gray-200', isLast && 'invisible')}
        />
      </div>

      <div className='flex-1 mb-8'>
        <button
          onClick={() => {
            onToggle();
            if (!isOpen && !email.isRead && email.direction === 'received') {
              onMarkAsRead();
            }
          }}
          className='w-full text-left p-2 -m-2 cursor-pointer'
        >
          <div className='flex items-center gap-1'>
            <span
              className={clsx('font-medium', !email.subject && 'text-gray-400')}
            >
              {email.subject || '(제목 없음)'}
            </span>
            <ChevronRight
              className={clsx(
                'w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0 transition-transform',
                isOpen && 'rotate-90'
              )}
            />
          </div>
        </button>

        {isOpen && (
          <div className='mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-900 whitespace-pre-wrap'>
            {email.body}
          </div>
        )}
      </div>
    </li>
  );
}

function StatusDropdown({
  onStatusChange,
  children,
}: {
  onStatusChange: (status: CreatorStatus) => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(CREATOR_STATUS_CONFIG).map(([status, { label }]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onStatusChange(status as CreatorStatus)}
            className='cursor-pointer'
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
