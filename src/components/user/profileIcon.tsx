'use client';

import ProfileDropdown from '@/components/user/profileDropdown';
import clsx from 'clsx';
import { Session } from 'next-auth';

export default function ProfileIcon({ session }: { session: Session | null }) {
  const user = session?.user;
  const name = user?.name || 'Guest';
  const initial = name.charAt(0).toUpperCase();

  return (
    <ProfileDropdown session={session}>
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
