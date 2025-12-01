import PostPreview from '@/components/post/postPreview';
import ProfileIcon from '@/components/user/profileIcon';
import UserNavTabs from '@/components/user/userTabs';
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
      {/* 추후에 유저 정보 추가 + 구독 구현할때 변경 */}
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

      <UserNavTabs userId={userId} />

      {posts.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          작성한 글이 없습니다.
        </div>
      ) : (
        <div className='flex flex-col'>
          {posts.map((post, index) => (
            <div key={post.id} className='mb-8'>
              <PostPreview tag={null} post={post} />
              {index !== posts.length - 1 && (
                <div className='h-px bg-gray-200' />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
