'use client';

import useUser from '@/features/user/domain/hooks/useUser';
import clsx from 'clsx';
import { useMemo } from 'react';

export default function ProfileIcon() {
  const { user } = useUser();

  const isActiveUser = useMemo(() => {
    return user?.userStatus === 'ACTIVE';
  }, [user?.userStatus]);

  const initial = (user?.nickname ?? 'Guest').charAt(0).toUpperCase();

  return (
    <div
      className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer',
        isActiveUser
          ? 'bg-blue-400 hover:bg-blue-500'
          : 'bg-gray-300 hover:bg-gray-400'
      )}
    >
      <span
        className={clsx(
          'text-sm font-semibold',
          isActiveUser ? 'text-white' : 'text-gray-600'
        )}
      >
        {initial}
      </span>
    </div>
  );
}
