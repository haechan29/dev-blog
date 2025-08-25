import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import { JSX } from 'react';

export default function BlogPage(): JSX.Element {
  const posts = getAllPosts().map((post) => post.toProps());

  return (
    <>
      <div className='flex flex-col'>
        {posts.map((post) => (
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