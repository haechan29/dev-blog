import { mdxComponents } from '@/lib/md/mdComponents';
import { mdxOptions } from '@/lib/md/mdConfig';
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
