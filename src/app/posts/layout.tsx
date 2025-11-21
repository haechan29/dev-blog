import PostsLayoutContainer from '@/components/post/postsLayoutContainer';
import { fetchPosts } from '@/features/post/domain/service/postService';
import { createProps } from '@/features/post/ui/postProps';
import { ReactNode } from 'react';

export default async function PostsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const posts = await fetchPosts().then(posts => posts.map(createProps));

  return <PostsLayoutContainer posts={posts}>{children}</PostsLayoutContainer>;
}
