import { mdxComponents } from '@/lib/mdx/mdxComponents';
import { mdxOptions } from '@/lib/mdx/mdxConfig';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default function PostContent({ content }: { content: string }) {
  return (
    <>
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={{
          mdxOptions,
        }}
      />
    </>
  );
}
