'use client';

import ProfileDropdown from '@/components/user/profileDropdown';
import ProfileIcon from '@/components/user/profileIcon';

export default function ToolbarProfileIcon() {
  return (
    <ProfileDropdown>
      <div aria-label='프로필 아이콘'>
        <ProfileIcon />
      </div>
    </ProfileDropdown>
  );
}
