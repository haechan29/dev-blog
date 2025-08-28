import { fetchAllPosts } from '@/features/post/domain/service/postService';
import Link from 'next/link';

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const tag = await searchParams.then(param => param.tag ?? null);
  const posts = await fetchAllPosts();
  const filteredPosts = tag ? posts.filter(post => post.tags?.includes(tag)) : posts;
  const postProps = filteredPosts.map(post => post.toProps());

  return (
    <>
      <div className='py-8 flex flex-col'>
        {postProps.map((post) => (
          <Link
            key={post.slug} 
            href={`/posts/${post.slug}`}
            className='w-full py-6 border-b border-b-gray-200'
          >
            <div className='text-xl font-semibold text-black mb-1 truncate'>{post.title}</div>
            <div className='text-gray-500 text-sm mb-4'>{post.date}</div>
            <div className='text-black line-clamp-3 mb-4'>{post.plainText}</div>
            <div className='flex'>
              {post.tags.map(tag => (
                <div key={tag} className='text-xs px-2 py-1 border border-gray-300 rounded-full mr-2'>{tag}</div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}