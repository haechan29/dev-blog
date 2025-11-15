import Comments from '@/components/comment/comments';
import LikeButtonItem from '@/components/post/likeButtonItem';
import PostContentWrapper from '@/components/post/postContentWrapper';
import PostHeader from '@/components/post/postHeader';
import PostPageClient from '@/components/post/postPageClient';
import PostParsedContent from '@/components/post/postParsedContent';
import PostRawContent from '@/components/post/postRawContent';
import PostToolbar from '@/components/post/postToolbar';
import EnterFullscreenButton from '@/components/postViewer/enterFullscreenButton';
import { fetchPost } from '@/features/post/domain/service/postService';
import { createProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
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
      <div
        className={clsx(
          'max-lg:mt-10 px-10 xl:px-20 py-14',
          'xl:ml-[var(--sidebar-width)]',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <PostPageClient post={post} />

        <EnterFullscreenButton />

        <PostHeader post={post} />
        <div className='w-full h-[1px] bg-gray-200 mb-10' />

        <PostContentWrapper
          post={post}
          parsed={<PostParsedContent content={post.content} />}
          raw={<PostRawContent content={post.content} />}
        />

        <Suspense>
          <LikeButtonItem postId={post.id} />
          <Comments {...post} />
        </Suspense>
      </div>
    </>
  );
}
