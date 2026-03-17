'use client';

import Comments from '@/components/comment/comments';
import HomeToolbar from '@/components/home/homeToolbar';
import AuthorProfile from '@/components/post/authorProfile';
import ForbiddenPostPage from '@/components/post/forbiddenPostPage';
import LikeButton from '@/components/post/likeButton';
import PostHeader from '@/components/post/postHeader';
import PostPreview from '@/components/post/postPreview';
import PostSeriesNav from '@/components/post/postSeriesNav';
import PostSidebar from '@/components/post/postSidebar';
import PostToolbar from '@/components/post/postToolbar';
import PostVisibilityBanner from '@/components/post/postVisibilityBanner';
import TableOfContents from '@/components/post/tableOfContents';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { PostForbiddenError } from '@/features/post/data/errors/postErrors';
import { renderContentElement } from '@/features/post/domain/lib/render';
import { getToolbarHeightPx } from '@/features/post/domain/lib/toolbarHeight';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import Heading from '@/features/post/domain/types/heading';
import useActiveHeading from '@/features/post/hooks/useActiveHeading';
import useBgmController from '@/features/post/hooks/useBgmController';
import useRecordView from '@/features/post/hooks/useRecordView';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { postKeys } from '@/queries/keys';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';

export default function PostPageClient({
  isLoggedIn,
  isCreator,
  userId,
  initialPost,
  initialComments,
  initialPosts,
  initialCursor,
}: {
  isLoggedIn: boolean;
  isCreator: boolean;
  userId?: string;
  initialPost: PostProps;
  initialComments: CommentItemProps[];
  initialPosts: PostProps[];
  initialCursor: string | null;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { ref, inView } = useInView();

  const {
    data: { pages },
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: postKeys.list(initialPost.id),
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

  const { data: post, error } = useQuery({
    queryKey: postKeys.detail(initialPost.id),
    queryFn: () => PostClientService.getPost(initialPost.id).then(createProps),
    initialData: initialPost,
  });

  const recommendedPosts = useMemo(
    () => pages.flatMap(page => page.posts),
    [pages]
  );

  const { headings, contentElement } = useMemo(
    () => renderContentElement(post.contentJson),
    [post.contentJson]
  );
  const currentHeadingId = useActiveHeading(headings);

  const handleHeadingClick = (heading: Heading) => {
    const element = document.getElementById(heading.id);
    if (element) {
      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        getToolbarHeightPx();
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

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

  if (error instanceof PostForbiddenError) {
    return <ForbiddenPostPage isLoggedIn={isLoggedIn} />;
  }

  return (
    <>
      <HomeToolbar isLoggedIn={isLoggedIn} className='max-xl:hidden' />
      <PostToolbar
        title={post.title}
        headings={headings}
        currentHeadingId={currentHeadingId}
        onHeadingClick={handleHeadingClick}
        className='xl:hidden'
        isHeaderVisible={isHeaderVisible}
      />

      <PostSidebar authorId={post.userId} currentPostId={post.id} />

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-12 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <div className='max-w-[65ch] mx-auto'>
          <PostHeader
            skipPasswordInput={isLoggedIn || isCreator}
            userId={userId}
            post={post}
            onVisibilityChange={setIsHeaderVisible}
          />
          <div className='w-full h-px bg-gray-200 mb-10' />
          <PostVisibilityBanner
            visibility={post.visibility}
            isAuthor={post.userId === userId}
          />

          {headings.length > 0 && (
            <div className='mb-10 xl:mb-0'>
              <div className='block xl:hidden text-xl xl:text-2xl font-bold text-gray-900 mt-4 mb-2 leading-tight'>
                목차
              </div>
              <TableOfContents
                headings={headings}
                currentHeadingId={currentHeadingId}
                onItemClick={handleHeadingClick}
              />
            </div>
          )}

          <div className='prose max-w-none mb-20'>{contentElement}</div>
          <LikeButton postId={post.id} likeCount={post.likeCount} />
          <PostSeriesNav post={post} />
          <AuthorProfile
            userId={post.userId}
            userName={post.authorName}
            userBio={post.bio ?? undefined}
            userProfileImageUrl={post.profileImageUrl ?? undefined}
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
                <PostPreview post={post} userId={userId} />
              </div>
            ))}

            <div ref={ref} />
            {isFetchingNextPage && (
              <div className='flex justify-center py-4'>
                <Loader2
                  strokeWidth={3}
                  className='animate-spin text-gray-400'
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
