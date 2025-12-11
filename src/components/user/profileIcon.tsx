'use client';

import clsx from 'clsx';

export default function ProfileIcon({
  nickname,
  isActive,
}: {
  nickname: string;
  isActive: boolean;
}) {
  const initial = nickname.charAt(0).toUpperCase();

  return (
    <div
      className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer',
        isActive
          ? 'bg-blue-400 hover:bg-blue-500'
          : 'bg-gray-300 hover:bg-gray-400'
      )}
    >
      <span
        className={clsx(
          'text-sm font-semibold',
          isActive ? 'text-white' : 'text-gray-600'
        )}
      >
        {initial}
      </span>
    </div>
  );
}
