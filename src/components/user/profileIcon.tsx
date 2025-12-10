'use client';

import useUser from '@/features/user/domain/hooks/useUser';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function ProfileIcon({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const initial = (
    isMounted && isLoggedIn && user?.nickname ? user.nickname : 'Guest'
  )
    .charAt(0)
    .toUpperCase();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer',
        isMounted && isLoggedIn
          ? 'bg-blue-400 hover:bg-blue-500'
          : 'bg-gray-300 hover:bg-gray-400'
      )}
    >
      <span
        className={clsx(
          'text-sm font-semibold',
          isMounted && isLoggedIn ? 'text-white' : 'text-gray-600'
        )}
      >
        {initial}
      </span>
    </div>
  );
}
