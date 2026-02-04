'use client';

import { getColorIndex } from '@/lib/color';
import clsx from 'clsx';
import Image from 'next/image';

const colors = [
  'bg-red-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-green-400',
  'bg-teal-400',
  'bg-blue-400',
  'bg-indigo-400',
  'bg-purple-400',
  'bg-pink-400',
];

export default function ProfileIcon({
  nickname,
  isActive,
  size = 'md',
  profileImageUrl = null,
}: {
  nickname: string;
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
  profileImageUrl?: string | null;
}) {
  const sizeClass =
    size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-9 h-9' : 'w-14 h-14';

  if (profileImageUrl) {
    return (
      <div className={clsx('shrink-0 rounded-full overflow-hidden', sizeClass)}>
        <Image
          src={profileImageUrl}
          alt={`${nickname} 프로필`}
          width={100}
          height={100}
          className='object-cover w-full h-full'
        />
      </div>
    );
  }

  const initial = nickname.charAt(0).toUpperCase();
  const colorIndex = getColorIndex(nickname);
  const baseColor = isActive ? colors[colorIndex] : 'bg-gray-300';

  return (
    <div
      className={clsx(
        'shrink-0 rounded-full flex items-center justify-center',
        sizeClass,
        baseColor
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
