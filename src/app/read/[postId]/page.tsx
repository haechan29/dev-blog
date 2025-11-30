export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import Comments from '@/components/comment/comments';
import LikeButton from '@/components/post/likeButton';
import PostContentWrapper from '@/components/post/postContentWrapper';
import PostHeader from '@/components/post/postHeader';
import PostPageClient from '@/components/post/postPageClient';
import PostParsedContent from '@/components/post/postParsedContent';
import PostRawContent from '@/components/post/postRawContent';
import EnterFullscreenButton from '@/components/postViewer/enterFullscreenButton';
import { fetchPost } from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { Suspense } from 'react';

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const { postId } = await params;
  const post = await fetchPost(postId).then(createProps);

  return (
    <>
      <PostPageClient post={post} />

      <EnterFullscreenButton />

      <PostHeader userId={userId} post={post} />
      <div className='w-full h-px bg-gray-200 mb-10' />

      <PostContentWrapper
        post={post}
        parsed={<PostParsedContent content={post.content} />}
        raw={<PostRawContent content={post.content} />}
      />

      <Suspense>
        <LikeButton postId={post.id} />
        <Comments {...post} />
      </Suspense>
    </>
  );
}
