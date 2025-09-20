import PostContentViewerClient from '@/components/post/postContentViewerClient';
import { serialize } from 'next-mdx-remote/serialize';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

export default async function PostContentViewer({
  content,
}: {
  content: string;
}) {
  const serializedContent = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [rehypePrettyCode, rehypeSlug],
    },
  });

  return <PostContentViewerClient mdxSource={serializedContent} />;
}
