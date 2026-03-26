'use client';

import HomeSidebar from '@/components/home/homeSidebar';
import HomeToolbar from '@/components/home/homeToolbar';
import { ReactNode, useState } from 'react';

export default function HomeLayoutClient({
  isLoggedIn,
  userId,
  tag,
  children,
}: {
  isLoggedIn: boolean;
  userId?: string;
  tag?: string;
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <HomeToolbar
        isLoggedIn={isLoggedIn}
        initialQuery={tag ? `#${tag}` : undefined}
        onSidebarOpenChange={setIsSidebarOpen}
      />

      {userId && (
        <HomeSidebar
          userId={userId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {children}
    </>
  );
}
