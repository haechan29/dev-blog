import { getPostBySlug } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function PostPage({ params }: { params: Promise<{ slug: string; }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return (
    <div className='max-w-2xl mx-auto px-4 py-20'>
      <div className='text-4xl font-bold mb-4'>{post.title}</div>
      <div className='flex mb-10'>
        <div className='text-gray-500 mr-4'>{post.date}</div>
        {post.tags?.map(tag => 
          <div key={tag} className='flex text-blue-500 mr-2'>{`#${tag}`}</div>
        )}
      </div>
      <div className='w-full h-[1px] bg-gray-200 mb-10'/>
      <div className='prose'>
        <MDXRemote source={post.content} />
      </div>
    </div>
  );
}