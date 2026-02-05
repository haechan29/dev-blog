'use client';

import ProfileDropdown from '@/components/user/profileDropdown';
import ProfileIcon from '@/components/user/profileIcon';
import useUser from '@/features/user/domain/hooks/useUser';

export default function ToolbarProfileIcon({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const { user } = useUser();

  if (!user) {
    return <ProfileIcon nickname='' skeleton />;
  }

  return (
    <ProfileDropdown
      isLoggedIn={isLoggedIn}
      userId={user.id}
      nickname={user.nickname}
      profileImageUrl={user.profileImageUrl ?? undefined}
    >
      <ProfileIcon
        nickname={user.nickname}
        profileImageUrl={user.profileImageUrl}
      />
    </ProfileDropdown>
  );
}
