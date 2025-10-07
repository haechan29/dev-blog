import { components } from '@/lib/mdxComponents';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';

export default function PostContentSection({ content }: { content: string }) {
  return (
    <div className='prose post-content mb-20'>
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypePrettyCode, rehypeSlug],
            remarkPlugins: [remarkBreaks],
          },
        }}
      />
    </div>
  );
}
