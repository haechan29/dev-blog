'use client';

import ProfileDropdown from '@/components/user/profileDropdown';
import ProfileIcon from '@/components/user/profileIcon';
import useUser from '@/features/user/domain/hooks/useUser';

export default function ToolbarProfileIcon() {
  const { user } = useUser();

  return (
    <ProfileDropdown>
      <div aria-label='프로필 아이콘'>
        <ProfileIcon isGuest={!user} nickname={user?.nickname} />
      </div>
    </ProfileDropdown>
  );
}
