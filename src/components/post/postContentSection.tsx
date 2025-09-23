import { compoenents } from '@/lib/mdxComponents';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

export default function PostContentSection({ content }: { content: string }) {
  return (
    <section className='prose post-content mb-20'>
      <MDXRemote
        source={content}
        components={compoenents}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypePrettyCode, rehypeSlug],
          },
        }}
      />
    </section>
  );
}
