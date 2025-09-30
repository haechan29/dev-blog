import CommentSection from '@/components/comment/commentSection';
import LikeButtonItem from '@/components/post/likeButtonItem';
import PostContentSection from '@/components/post/postContentSection';
import PostDispatcher from '@/components/post/postDispatcher';
import PostHeaderSection from '@/components/post/postHeaderSection';
import PostViewTracker from '@/components/post/postViewTracker';
import TableOfContentsItem from '@/components/post/tableOfContentsItem';
import PostViewer from '@/components/postViewer/postViewer';
import PostViewerModeButton from '@/components/postViewer/postViewerModeButton';
import { Post } from '@/features/post/domain/model/post';
import { fetchPostBySlug } from '@/features/post/domain/service/postService';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  const postProps = (post as Post).toProps();

  return (
    <div>
      <div className='px-10 xl:px-20 py-14'>
        <Suspense>
          <PostDispatcher post={postProps} />
        </Suspense>
        <PostViewTracker postId={postProps.slug} />

        <PostViewerModeButton />

        <PostViewer postProps={postProps} />

        <PostHeaderSection post={postProps} className='mb-10' />
        <div className='w-full h-[1px] bg-gray-200 mb-10' />

        {postProps.headings.length > 0 && (
          <section className='mb-10 xl:mb-0'>
            <div className='block xl:hidden text-xl xl:text-2xl font-bold text-gray-900 mt-4 mb-2 leading-tight'>
              목차
            </div>
            <TableOfContentsItem headings={postProps.headings} />
          </section>
        )}

        <PostContentSection content={postProps.content} />

        <LikeButtonItem
          postId={post.slug}
          className='flex justify-center mb-20'
        />

        <ErrorBoundary fallback={<div></div>}>
          <Suspense fallback={<div></div>}>
            <CommentSection slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
