import PostViewer from '@/components/postViewer/postViewer';
import { fetchPostBySlug } from '@/features/post/domain/service/postService';
import { createProps } from '@/features/post/ui/postProps';
import { ReactNode } from 'react';

export default async function PostLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  const postProps = createProps(post);

  return (
    <div className='min-h-screen bg-white'>
      <PostViewer post={postProps} />
      <div className='px-10 xl:px-20 py-14'>{children}</div>
    </div>
  );
}
