'use client';

import { Session } from 'next-auth';

export default function ProfileIcon({ session }: { session: Session | null }) {
  if (!session?.user) {
    return (
      <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center'>
        <span className='text-sm font-semibold text-gray-600'>G</span>
      </div>
    );
  }

  const name = session.user.name || 'User';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className='w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center'>
      <span className='text-sm font-semibold text-white'>{initial}</span>
    </div>
  );
}
