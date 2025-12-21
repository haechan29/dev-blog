import { auth } from '@/auth';
import PostPreview from '@/components/post/postPreview';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { cookies } from 'next/headers';

export default async function PostsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const session = await auth();
  const currentUserId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const posts = await PostServerService.getPostsByUserId(userId).then(posts =>
    posts.map(createProps)
  );

  return posts.length === 0 ? (
    <div className='text-center py-20 text-gray-500'>작성한 글이 없습니다.</div>
  ) : (
    <div className='flex flex-col'>
      {posts.map((post, index) => (
        <div key={post.id} className='mb-8'>
          <PostPreview
            isLoggedIn={!!session}
            post={post}
            userId={currentUserId}
          />
          {index !== posts.length - 1 && <div className='h-px bg-gray-200' />}
        </div>
      ))}
    </div>
  );
}
