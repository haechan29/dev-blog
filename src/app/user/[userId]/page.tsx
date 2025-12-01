import ProfileIcon from '@/components/user/profileIcon';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import * as UserServerService from '@/features/user/domain/service/userServerService';
import { notFound } from 'next/navigation';

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const [user, posts] = await Promise.all([
    UserServerService.fetchUserById(userId),
    PostServerService.fetchPostsByUserId(userId).then(posts =>
      posts.map(createProps)
    ),
  ]);

  if (!user || user.deletedAt !== null) {
    notFound();
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-center space-x-3 mb-8'>
        <ProfileIcon isGuest={false} nickname={user.nickname} />
        <div>
          <div className='font-semibold text-gray-900 text-xl'>
            {user.nickname}
          </div>
          <p className='text-sm text-gray-500'>
            가입일: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* TODO: 탭 (글/시리즈) */}

      {/* 글 목록 */}
      {posts.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          작성한 글이 없습니다.
        </div>
      ) : (
        <div className='text-center py-20 text-gray-500'>
          작성한 글이 없습니다.
        </div>
      )}
    </div>
  );
}
