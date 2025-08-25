import { getPostBySlug } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import TableOfContents from '@/components/tableOfContentsItem';
import ToggleButtonItem from '@/components/toggleButtonItem';
import { ReactNode } from 'react';

const ExternalLink = ({children, ...props}: { children: ReactNode; }) => {
  return <a rel='noopener noreferrer' target='_blank' { ...props }>{children}</a>
};

export default async function PostPage({ params }: { params: Promise<{ slug: string; }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug).toProps();

  return (
    <div className='max-w-2xl mx-auto px-4 py-20'>
      {post.headings.length > 0 && (<TableOfContents headings={post.headings}/>)}
      <div className='text-4xl font-bold mb-4'>{post.title}</div>
      <div className='flex mb-10'>
        <div className='text-gray-500 mr-4'>{post.date}</div>
        {post.tags?.map(tag => 
          <div key={tag} className='flex text-blue-500 mr-2'>{`#${tag}`}</div>
        )}
      </div>
      <div className='w-full h-[1px] bg-gray-200 mb-10'/>
      <div className='prose'>
        <MDXRemote
          source={post.content}
          components={{
            ToggleButtonItem,
            a: ExternalLink
          }}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypePrettyCode],
                rehypeSlug
              ]
            }
          }}
        />
      </div>
    </div>
  );
}