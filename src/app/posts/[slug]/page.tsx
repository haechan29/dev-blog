import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import TableOfContentsItem from '@/components/tableOfContentsItem';
import ToggleButtonItem from '@/components/toggleButtonItem';
import { ReactNode, Suspense } from 'react';
import { Post } from '@/features/post/domain/model/post';
import { fetchPostBySlug } from '@/features/post/domain/service/postService';
import CommentSection from '@/components/commentSection';
import { ErrorBoundary } from 'react-error-boundary';
import PostViewTracker from '@/components/postViewTracker';
import LikeButtonItem from '@/components/likeButtonItem';
import Link from 'next/link';
import PostInfoItem from '@/components/postInfoItem';

const ExternalLink = ({ children, ...props }: { children: ReactNode }) => {
  return (
    <a rel='noopener noreferrer' target='_blank' {...props}>
      {children}
    </a>
  );
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  const postProps = (post as Post).toProps();

  return (
    <div className='py-14'>
      <PostViewTracker post={postProps} />

      <section className='mb-10'>
        <div className='text-3xl font-bold mb-6'>{postProps.title}</div>
        <div className='flex flex-wrap gap-3 mb-6'>
          {postProps.tags?.map(tag => (
            <Link
              key={tag}
              href={`/posts?tag=${tag}`}
              className='text-xs px-2 py-1 border border-gray-300 rounded-full hover:text-blue-500 hover:border-blue-200'
            >
              {tag}
            </Link>
          ))}
        </div>
        <PostInfoItem post={postProps} />
      </section>
      <div className='w-full h-[1px] bg-gray-200 mb-10' />

      {postProps.headings.length > 0 && (
        <section className='mb-10 xl:mb-0'>
          <div className='block xl:hidden text-2xl font-bold text-gray-900 mt-4 mb-2 leading-tight'>
            목차
          </div>
          <TableOfContentsItem headings={postProps.headings} />
        </section>
      )}

      <section className='prose mb-20'>
        <MDXRemote
          source={postProps.content}
          components={{
            ToggleButtonItem,
            a: ExternalLink,
          }}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypePrettyCode], rehypeSlug],
            },
          }}
        />
      </section>

      <section className='flex justify-center mb-20'>
        <LikeButtonItem postId={post.slug} />
      </section>

      <ErrorBoundary fallback={<div></div>}>
        <Suspense fallback={<div></div>}>
          <CommentSection slug={slug} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
