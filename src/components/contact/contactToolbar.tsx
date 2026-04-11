'use client';

import Logo from '@/components/logo';
import NotificationPopover from '@/components/notification/notificationPopover';
import ToolbarProfileIcon from '@/components/post/toolbarProfileIcon';
import { cn } from '@/lib/utils';

export default function ContactToolbar({
  isLoggedIn,
  className,
}: {
  isLoggedIn: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'fixed top-0 z-40 w-full flex items-center',
        'py-2 md:py-3 px-4 md:px-6 gap-4 bg-white/80 backdrop-blur-md',
        className
      )}
    >
      <Logo />

      <div className='flex flex-1 min-w-0' />

      <div className='flex items-center gap-3'>
        <div className='hidden sm:flex'>
          <NotificationPopover />
        </div>

        <ToolbarProfileIcon isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
