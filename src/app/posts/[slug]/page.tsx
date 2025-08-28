import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import TableOfContentsItem from '@/components/tableOfContentsItem';
import ToggleButtonItem from '@/components/toggleButtonItem';
import { ReactNode } from 'react';
import { Post } from '@/features/post/domain/model/post';
import { fetchPostBySlug } from '@/features/post/domain/service/postService';

const ExternalLink = ({children, ...props}: { children: ReactNode; }) => {
  return <a rel='noopener noreferrer' target='_blank' { ...props }>{children}</a>
};

export default async function PostPage({ params }: { params: Promise<{ slug: string; }> }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  const postProps = (post as Post).toProps();

  return (
    <div className='py-14'>
      <div className='text-4xl font-bold mb-4'>{postProps.title}</div>
      <div className='flex mb-10'>
        <div className='text-gray-500 mr-4'>{postProps.date}</div>
        {postProps.tags?.map(tag => 
          <div key={tag} className='flex text-blue-500 mr-2'>{`#${tag}`}</div>
        )}
      </div>
      <div className='w-full h-[1px] bg-gray-200 mb-10'/>
      {postProps.headings.length > 0 && (
        <div className='mb-10 xl:mb-0'>
          <div className='block xl:hidden text-2xl font-bold text-gray-900 mt-4 mb-2 leading-tight'>목차</div>
          <TableOfContentsItem headings={postProps.headings}/>
        </div>
      )}
      <div className='prose'>
        <MDXRemote
          source={postProps.content}
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