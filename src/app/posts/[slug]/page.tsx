import { getPostBySlug } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function PostPage({ params }: { params: Promise<{ slug: string; }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <div className='text-2xl font-bold mb-2'>{post.title}</div>
      <div className='text-sm text-gray-500 mb-10'>{post.date}</div>
      <div>
        <MDXRemote source={post.content} />
      </div>
    </div>
  );
}