import TableOfContentsItem from '@/components/tableOfContentsItem';
import { Suspense } from 'react';
import { Post } from '@/features/post/domain/model/post';
import { fetchPostBySlug } from '@/features/post/domain/service/postService';
import CommentSection from '@/components/commentSection';
import { ErrorBoundary } from 'react-error-boundary';
import PostViewTracker from '@/components/postViewTracker';
import LikeButtonItem from '@/components/likeButtonItem';
import PostHeaderSection from '@/components/postHeaderSection';
import PostContentSection from '@/components/postContentSection';
import PostDispatcher from '@/components/postDispatcher';

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
        <PostDispatcher post={postProps} />
        <PostViewTracker postId={postProps.slug} />

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

        <PostContentSection post={postProps} className='prose mb-20' />

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
