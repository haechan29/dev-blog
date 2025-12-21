'use client';

import Comments from '@/components/comment/comments';
import HomeToolbar from '@/components/home/homeToolbar';
import LikeButton from '@/components/post/likeButton';
import PostContentWrapper from '@/components/post/postContentWrapper';
import PostHeader from '@/components/post/postHeader';
import PostPreview from '@/components/post/postPreview';
import PostSeriesNav from '@/components/post/postSeriesNav';
import PostSidebar from '@/components/post/postSidebar';
import PostToolbar from '@/components/post/postToolbar';
import UserProfile from '@/components/post/userProfile';
import EnterFullscreenButton from '@/components/postViewer/enterFullscreenButton';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import useBgmController from '@/features/post/hooks/useBgmController';
import usePostToolbarSync from '@/features/post/hooks/usePostToolbarSync';
import useRecordView from '@/features/post/hooks/useRecordView';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { postsKeys } from '@/queries/keys';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { ReactNode, Suspense, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';

export default function PostPageClient({
  isLoggedIn,
  userId,
  initialPost,
  initialComments,
  initialPosts,
  initialCursor,
  parsedContent,
}: {
  isLoggedIn: boolean;
  userId?: string;
  initialPost: PostProps;
  initialComments: CommentItemProps[];
  initialPosts: PostProps[];
  initialCursor: string | null;
  parsedContent: ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const { ref, inView } = useInView();

  const {
    data: { pages },
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: postsKeys.list(initialPost.id),
    queryFn: async ({ pageParam }) => {
      const result = await PostClientService.getFeedPosts(
        pageParam,
        initialPost.id
      );
      return {
        posts: result.posts.map(createProps),
        nextCursor: result.nextCursor,
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialData: {
      pages: [{ posts: initialPosts, nextCursor: initialCursor }],
      pageParams: [null],
    },
  });

  const { data: post } = useQuery({
    queryKey: postsKeys.detail(initialPost.id),
    queryFn: () => PostClientService.getPost(initialPost.id).then(createProps),
    initialData: initialPost,
  });

  const recommendedPosts = useMemo(
    () => pages.flatMap(page => page.posts),
    [pages]
  );

  usePostToolbarSync(initialPost);
  useRecordView(initialPost.id);
  useBgmController();

  useEffect(() => {
    dispatch(setIsVisible(false));
  }, [dispatch]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <Suspense>
        <HomeToolbar isLoggedIn={isLoggedIn} className='max-xl:hidden' />
        <PostToolbar className='xl:hidden' />
      </Suspense>

      <PostSidebar userId={post.userId} currentPostId={post.id} />

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-12 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <EnterFullscreenButton />

        <PostHeader isLoggedIn={isLoggedIn} userId={userId} post={post} />
        <div className='w-full h-px bg-gray-200 mb-10' />

        <PostContentWrapper post={post} parsedContent={parsedContent} />

        <LikeButton postId={post.id} likeCount={post.likeCount} />

        <PostSeriesNav post={post} />

        <UserProfile
          userId={post.userId}
          userName={post.authorName}
          userStatus={post.userStatus}
          currentUserId={userId}
          className='mb-12'
        />

        <Comments
          isLoggedIn={isLoggedIn}
          userId={userId}
          postId={post.id}
          initialComments={initialComments}
        />

        <div className='flex flex-col'>
          {recommendedPosts.map(post => (
            <div key={post.id}>
              <div className='h-px bg-gray-200 mb-8' />
              <PostPreview
                isLoggedIn={isLoggedIn}
                post={post}
                userId={userId}
              />
            </div>
          ))}

          <div ref={ref} />
          {isFetchingNextPage && (
            <div className='flex justify-center py-4'>
              <Loader2 strokeWidth={3} className='animate-spin text-gray-400' />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
