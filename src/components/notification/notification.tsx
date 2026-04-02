'use client';

import ProfileIcon from '@/components/user/profileIcon';
import type { NotificationProps } from '@/features/notification/ui/model/notificationProps';
import clsx from 'clsx';
import { BarChart3, Heart, ThumbsUp, Users } from 'lucide-react';
import Link from 'next/link';

function NotificationLeading({
  notification,
}: {
  notification: NotificationProps;
}) {
  const iconShellClass =
    'shrink-0 flex items-center justify-center w-8 h-8 rounded-full';

  switch (notification.type) {
    case 'comment':
      return (
        <ProfileIcon
          nickname={notification.representativeNickname}
          size='md'
          profileImageUrl={notification.representativeProfileImageUrl}
        />
      );
    case 'post_view_milestone':
      return (
        <div className={clsx(iconShellClass, 'bg-green-50')} aria-hidden>
          <BarChart3 className='w-4 h-4 text-green-700' strokeWidth={2} />
        </div>
      );
    case 'post_like_milestone':
      return (
        <div className={clsx(iconShellClass, 'bg-red-50')} aria-hidden>
          <Heart className='w-4 h-4 text-pink-600' strokeWidth={2} />
        </div>
      );
    case 'comment_like_milestone':
      return (
        <div className={clsx(iconShellClass, 'bg-sky-100')} aria-hidden>
          <ThumbsUp className='w-4 h-4 text-blue-600' strokeWidth={2} />
        </div>
      );
    case 'subscriber_milestone':
      return (
        <div className={clsx(iconShellClass, 'bg-indigo-100')} aria-hidden>
          <Users className='w-4 h-4 text-indigo-700' strokeWidth={2} />
        </div>
      );
  }
}

export default function Notification({
  notification,
}: {
  notification: NotificationProps;
}) {
  const rowClass =
    'flex gap-3 items-start border-b border-gray-100 last:border-b-0 transition-colors p-3';

  const inner = (
    <>
      <div className='relative shrink-0'>
        {!notification.isRead && (
          <span
            className='absolute -top-0.5 -left-0.5 h-1.5 w-1.5 rounded-full bg-sky-500 ring-2 ring-white'
            aria-hidden
          />
        )}
        <NotificationLeading notification={notification} />
      </div>
      <div className='flex flex-col gap-1 min-w-0 flex-1 text-left'>
        <p className='text-sm leading-snug text-gray-900'>
          {notification.primary}
        </p>
        {notification.secondary && (
          <p className='text-xs text-gray-500 line-clamp-2 leading-snug'>
            {notification.secondary}
          </p>
        )}
        <p className='text-[11px] text-gray-400 tabular-nums'>
          {notification.updatedAt}
        </p>
      </div>
    </>
  );

  if (notification.href) {
    return (
      <Link
        href={notification.href}
        className={clsx(rowClass, 'hover:bg-gray-50/80 block')}
      >
        {inner}
      </Link>
    );
  }

  return <div className={rowClass}>{inner}</div>;
}
