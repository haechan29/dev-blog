'use client';

import clsx from 'clsx';

const colors = [
  'bg-red-400 hover:bg-red-500',
  'bg-orange-400 hover:bg-orange-500',
  'bg-amber-400 hover:bg-amber-500',
  'bg-green-400 hover:bg-green-500',
  'bg-teal-400 hover:bg-teal-500',
  'bg-blue-400 hover:bg-blue-500',
  'bg-indigo-400 hover:bg-indigo-500',
  'bg-purple-400 hover:bg-purple-500',
  'bg-pink-400 hover:bg-pink-500',
];

export default function ProfileIcon({
  nickname,
  isActive,
  size = 'md',
}: {
  nickname: string;
  isActive: boolean;
  size?: 'sm' | 'md';
}) {
  const initial = nickname.charAt(0).toUpperCase();
  const color = isActive
    ? colors[getColorIndex(nickname)]
    : 'bg-gray-300 hover:bg-gray-400';

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center cursor-pointer',
        size === 'sm' ? 'w-6 h-6' : 'w-8 h-8',
        color
      )}
    >
      <span
        className={clsx(
          'font-semibold',
          size === 'sm' ? 'text-xs' : 'text-sm',
          isActive ? 'text-white' : 'text-gray-600'
        )}
      >
        {initial}
      </span>
    </div>
  );
}

function getColorIndex(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % colors.length;
}
