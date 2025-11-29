'use client';

import ProfileDropdown from '@/components/user/profileDropdown';
import useUser from '@/features/user/domain/hooks/useUser';
import clsx from 'clsx';

export default function ProfileIcon() {
  const { user } = useUser();
  const name = user?.nickname || 'Guest';
  const initial = name.charAt(0).toUpperCase();

  return (
    <ProfileDropdown>
      <button
        aria-label='프로필 메뉴'
        data-is-user={user !== null}
        className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer',
          user
            ? 'bg-blue-400 hover:bg-blue-500'
            : 'bg-gray-300 hover:bg-gray-400'
        )}
      >
        <span
          className={clsx(
            'text-sm font-semibold',
            user ? 'text-white' : 'text-gray-600'
          )}
        >
          {initial}
        </span>
      </button>
    </ProfileDropdown>
  );
}
