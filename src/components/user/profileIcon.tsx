'use client';

import clsx from 'clsx';

export default function ProfileIcon({
  isGuest,
  nickname,
}: {
  isGuest: boolean;
  nickname?: string | null;
}) {
  const initial = (nickname ?? 'Guest').charAt(0).toUpperCase();

  return (
    <div
      className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer',
        isGuest
          ? 'bg-gray-300 hover:bg-gray-400'
          : 'bg-blue-400 hover:bg-blue-500'
      )}
    >
      <span
        className={clsx(
          'text-sm font-semibold',
          isGuest ? 'text-gray-600' : 'text-white'
        )}
      >
        {initial}
      </span>
    </div>
  );
}
