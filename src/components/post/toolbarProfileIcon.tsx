'use client';

import ProfileDropdown from '@/components/user/profileDropdown';
import ProfileIcon from '@/components/user/profileIcon';
import useUser from '@/features/user/domain/hooks/useUser';
import { useEffect, useState } from 'react';

export default function ToolbarProfileIcon({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const displayName = !isMounted
    ? 'Guest'
    : isLoggedIn && user?.nickname
    ? user.nickname
    : `Guest#${user?.id?.slice(0, 4) ?? '0000'}`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ProfileDropdown
      isLoggedIn={isLoggedIn}
      userId={user?.id}
      nickname={displayName}
    >
      <ProfileIcon nickname={displayName} isActive={!!user && isLoggedIn} />
    </ProfileDropdown>
  );
}
