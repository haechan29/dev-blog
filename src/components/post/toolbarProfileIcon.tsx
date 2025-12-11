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
  const displayName =
    isMounted && isLoggedIn && user?.nickname ? user.nickname : 'Guest';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    user && (
      <ProfileDropdown isLoggedIn={isLoggedIn}>
        <div aria-label='프로필 아이콘'>
          <ProfileIcon nickname={displayName} isActive={isLoggedIn} />
        </div>
      </ProfileDropdown>
    )
  );
}
