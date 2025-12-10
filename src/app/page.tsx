export const dynamic = 'force-dynamic';

import PostPreview from '@/components/post/postPreview';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';

export default async function HomePage() {
  const posts = await PostServerService.fetchPosts().then(posts =>
    posts.map(createProps)
  );

  return (
    <div className='flex flex-col mt-8 mb-20'>
      {posts.map((post, index) => (
        <div key={post.id} className='mb-8'>
          <PostPreview post={post} />
          {index !== posts.length - 1 && <div className='h-px bg-gray-200' />}
        </div>
      ))}
    </div>
  );
}
