'use client';

import Comments from '@/components/comment/comments';
import LikeButton from '@/components/post/likeButton';
import PostContentWrapper from '@/components/post/postContentWrapper';
import PostHeader from '@/components/post/postHeader';
import PostSidebar from '@/components/post/postSidebar';
import PostsToolbar from '@/components/post/postsToolbar';
import PostToolbar from '@/components/post/postToolbar';
import EnterFullscreenButton from '@/components/postViewer/enterFullscreenButton';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import useBgmController from '@/features/post/hooks/useBgmController';
import usePostToolbarSync from '@/features/post/hooks/usePostToolbarSync';
import useViewTracker from '@/features/post/hooks/useViewTracker';
import { PostProps } from '@/features/post/ui/postProps';
import clsx from 'clsx';
import { ReactNode, Suspense } from 'react';

export default function PostPageClient({
  isLoggedIn,
  userId,
  post,
  initialComments,
  parsedContent,
}: {
  isLoggedIn: boolean;
  userId: string;
  post: PostProps;
  initialComments: CommentItemProps[];
  parsedContent: ReactNode;
}) {
  usePostToolbarSync(post);
  useViewTracker(post.id);
  useBgmController();

  return (
    <>
      <Suspense>
        <PostsToolbar isLoggedIn={isLoggedIn} className='max-xl:hidden' />
        <PostToolbar className='xl:hidden' />
      </Suspense>

      <PostSidebar userId={post.userId} currentPostId={post.id} />

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-20 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <EnterFullscreenButton />

        <PostHeader isLoggedIn={isLoggedIn} userId={userId} post={post} />
        <div className='w-full h-px bg-gray-200 mb-10' />

        <PostContentWrapper post={post} parsedContent={parsedContent} />

        <LikeButton postId={post.id} />

        <Comments
          isLoggedIn={isLoggedIn}
          userId={userId}
          postId={post.id}
          initialComments={initialComments}
        />
      </div>
    </>
  );
}
