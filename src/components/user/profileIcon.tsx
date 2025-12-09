'use client';

import useUser from '@/features/user/domain/hooks/useUser';
import clsx from 'clsx';

export default function ProfileIcon({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { user } = useUser();
  const initial = (isLoggedIn && user?.nickname ? user.nickname : 'Guest')
    .charAt(0)
    .toUpperCase();

  return (
    <div
      className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer',
        isLoggedIn
          ? 'bg-blue-400 hover:bg-blue-500'
          : 'bg-gray-300 hover:bg-gray-400'
      )}
    >
      <span
        className={clsx(
          'text-sm font-semibold',
          isLoggedIn ? 'text-white' : 'text-gray-600'
        )}
      >
        {initial}
      </span>
    </div>
  );
}
