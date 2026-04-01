'use client';

import BellIcon from '@/components/bellIcon';
import Logo from '@/components/logo';
import ToolbarProfileIcon from '@/components/post/toolbarProfileIcon';
import SearchCommand from '@/components/search/searchCommand';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';

export default function HomeToolbar({
  isLoggedIn,
  initialQuery,
  className,
  onSidebarOpenChange,
}: {
  isLoggedIn: boolean;
  initialQuery?: string;
  className?: string;
  onSidebarOpenChange?: (isOpen: boolean) => void;
}) {
  return (
    <div
      className={cn(
        'fixed top-0 z-40 w-full flex items-center',
        'py-2 md:py-3 px-4 md:px-6 gap-4 bg-white/80 backdrop-blur-md',
        className
      )}
    >
      <button
        onClick={() => onSidebarOpenChange?.(true)}
        className='xl:hidden shrink-0 p-2 -m-2 items-center justify-center'
        aria-label='메뉴 열기'
      >
        <Menu className='w-6 h-6 text-gray-500' />
      </button>

      <Logo onClick={() => onSidebarOpenChange?.(false)} />

      <div className='flex flex-1 min-w-0 justify-center'>
        <div className='max-md:hidden w-1/2'>
          <SearchCommand initialQuery={initialQuery} />
        </div>
      </div>

      <Link
        href='/search'
        className='md:hidden shrink-0 p-2 -m-2 cursor-pointer rounded-full hover:bg-gray-100'
        aria-label='검색'
      >
        <Search className='w-6 h-6' />
      </Link>

      <div className='flex items-center gap-3'>
        <Link
          href={`/write`}
          className={clsx(
            'text-sm font-semibold py-2 px-4 rounded-full text-nowrap',
            'bg-gray-100 hover:bg-gray-200'
          )}
        >
          {'글 쓰기'}
        </Link>

        <div className='hidden sm:flex'>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type='button'
                className='shrink-0 p-2 -m-2 cursor-pointer rounded-full hover:bg-gray-100'
                aria-label='알림'
              >
                <BellIcon className='w-6 h-6' strokeWidth={1.5} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align='end'
              sideOffset={8}
              onOpenAutoFocus={e => e.preventDefault()}
            >
              <div className='text-sm text-gray-600'>알림 기능 준비중</div>
            </PopoverContent>
          </Popover>
        </div>

        <ToolbarProfileIcon isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
