import PostPreview from '@/components/post/postPreview';
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
      {/* 프로필 헤더 */}
      <div>
        <h1 className='text-3xl font-bold'>{user.nickname}</h1>
        <p className='text-gray-500 text-sm mt-2'>
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* TODO: 탭 (글/시리즈) */}

      {/* 글 목록 */}
      <div className='flex flex-col'>
        {posts.map((post, index) => (
          <div key={post.id} className='mb-8'>
            <PostPreview tag={null} post={post} />
            {index !== posts.length - 1 && <div className='h-px bg-gray-200' />}
          </div>
        ))}
      </div>
    </div>
  );
}
