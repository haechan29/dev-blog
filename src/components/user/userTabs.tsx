'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserNavTabs({ userId }: { userId: string }) {
  const pathname = usePathname();

  const tabs = [
    { key: 'posts', label: '글' },
    { key: 'series', label: '시리즈' },
  ];

  return (
    <div className='border-b border-gray-200'>
      <div className='flex gap-6'>
        {tabs.map(({ key, label }) => (
          <Link
            key={key}
            href={`/@${userId}/${key}`}
            className={clsx(
              'py-3 px-1 min-w-12 text-center',
              pathname.includes(`/${key}`)
                ? 'border-b-2 border-gray-700 text-gray-900 font-semibold'
                : 'hover:border-b-2 border-gray-300 text-gray-700'
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
