'use client';

import Comments from '@/components/comment/comments';
import HomeToolbar from '@/components/home/homeToolbar';
import LikeButton from '@/components/post/likeButton';
import PostContentWrapper from '@/components/post/postContentWrapper';
import PostHeader from '@/components/post/postHeader';
import PostSeriesNav from '@/components/post/postSeriesNav';
import PostSidebar from '@/components/post/postSidebar';
import PostToolbar from '@/components/post/postToolbar';
import UserProfile from '@/components/post/userProfile';
import EnterFullscreenButton from '@/components/postViewer/enterFullscreenButton';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import useBgmController from '@/features/post/hooks/useBgmController';
import usePostToolbarSync from '@/features/post/hooks/usePostToolbarSync';
import useViewTracker from '@/features/post/hooks/useViewTracker';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ReactNode, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function PostPageClient({
  isLoggedIn,
  userId,
  initialPost,
  initialComments,
  parsedContent,
}: {
  isLoggedIn: boolean;
  userId?: string;
  initialPost: PostProps;
  initialComments: CommentItemProps[];
  parsedContent: ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const { data: post } = useQuery({
    queryKey: ['posts', initialPost.id],
    queryFn: () =>
      PostClientService.fetchPost(initialPost.id).then(createProps),
    initialData: initialPost,
  });

  usePostToolbarSync(initialPost);
  useViewTracker(initialPost.id);
  useBgmController();

  useEffect(() => {
    dispatch(setIsVisible(false));
  }, [dispatch]);

  return (
    <>
      <Suspense>
        <HomeToolbar isLoggedIn={isLoggedIn} className='max-xl:hidden' />
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

        <PostSeriesNav post={post} />

        <UserProfile
          userId={post.userId}
          userName={post.authorName}
          userStatus={post.userStatus}
          currentUserId={userId}
        />

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
