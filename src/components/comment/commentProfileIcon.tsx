'use client';

import ProfileIcon from '@/components/user/profileIcon';

export default function CommentProfileIcon({
  isLoggedIn,
  authorId,
}: {
  isLoggedIn: boolean;
  authorId: string | null;
}) {
  const handleClick = () => {
    if (authorId) {
      // 블로그로 이동 구현
    }
  };

  return (
    <button
      aria-label='댓글을 작성한 유저의 프로필 아이콘'
      onClick={handleClick}
    >
      <ProfileIcon isLoggedIn={isLoggedIn} />
    </button>
  );
}
