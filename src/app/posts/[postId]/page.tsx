import Comments from '@/components/comment/comments';
import LikeButtonItem from '@/components/post/likeButtonItem';
import PostContent from '@/components/post/postContent';
import PostContentWrapper from '@/components/post/postContentWrapper';
import PostHeader from '@/components/post/postHeader';
import PostHeaderWrapper from '@/components/post/postHeaderWrapper';
import PostPageClient from '@/components/post/postPageClient';
import PostToolbar from '@/components/post/postToolbar';
import TableOfContentsItem from '@/components/post/tableOfContentsItem';
import EnterFullscreenButton from '@/components/postViewer/enterFullscreenButton';
import { fetchPost } from '@/features/post/domain/service/postService';
import { createProps } from '@/features/post/ui/postProps';
import { Suspense } from 'react';

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await fetchPost(postId).then(createProps);

  return (
    <>
      <PostToolbar />
      <div className='px-10 xl:px-20 py-14'>
        <PostPageClient post={post} />

        <EnterFullscreenButton />

        <PostHeaderWrapper>
          <PostHeader post={post} />
        </PostHeaderWrapper>
        <div className='w-full h-[1px] bg-gray-200 mb-10' />

        {post.headings.length > 0 && (
          <section className='mb-10 xl:mb-0'>
            <div className='block xl:hidden text-xl xl:text-2xl font-bold text-gray-900 mt-4 mb-2 leading-tight'>
              목차
            </div>
            <TableOfContentsItem headings={post.headings} />
          </section>
        )}

        <PostContentWrapper post={post}>
          <PostContent content={post.content} />
        </PostContentWrapper>

        <Suspense>
          <LikeButtonItem postId={post.id} />

          <Comments {...post} />
        </Suspense>
      </div>
    </>
  );
}
