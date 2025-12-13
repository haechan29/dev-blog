'use client';

import clsx from 'clsx';

const colors = [
  { base: 'bg-red-400', hover: 'hover:bg-red-500' },
  { base: 'bg-orange-400', hover: 'hover:bg-orange-500' },
  { base: 'bg-amber-400', hover: 'hover:bg-amber-500' },
  { base: 'bg-green-400', hover: 'hover:bg-green-500' },
  { base: 'bg-teal-400', hover: 'hover:bg-teal-500' },
  { base: 'bg-blue-400', hover: 'hover:bg-blue-500' },
  { base: 'bg-indigo-400', hover: 'hover:bg-indigo-500' },
  { base: 'bg-purple-400', hover: 'hover:bg-purple-500' },
  { base: 'bg-pink-400', hover: 'hover:bg-pink-500' },
];

export default function ProfileIcon({
  nickname,
  isActive,
  size = 'md',
  hoverable = true,
}: {
  nickname: string;
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}) {
  const initial = nickname.charAt(0).toUpperCase();
  const colorIndex = getColorIndex(nickname);
  const baseColor = isActive ? colors[colorIndex].base : 'bg-gray-300';
  const hoverColor = hoverable
    ? isActive
      ? colors[colorIndex].hover
      : 'hover:bg-gray-400'
    : '';

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center',
        hoverable && 'cursor-pointer',
        size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-14 h-14',
        baseColor,
        hoverColor
      )}
    >
      <span
        className={clsx(
          'font-semibold',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-2xl',
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
