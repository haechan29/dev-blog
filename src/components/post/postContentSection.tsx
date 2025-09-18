import ContentSectionDetector from '@/components/post/contentSectionDetector';
import ToggleButtonItem from '@/components/post/toggleButtonItem';
import { PostItemProps } from '@/features/post/ui/postItemProps';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ReactNode } from 'react';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

const ExternalLink = ({ children, ...props }: { children: ReactNode }) => {
  return (
    <a rel='noopener noreferrer' target='_blank' {...props}>
      {children}
    </a>
  );
};

export default function PostContentSection({
  post,
  className,
}: {
  post: PostItemProps;
  className?: string;
}) {
  return (
    <section className={className}>
      <ContentSectionDetector />
      <MDXRemote
        source={post.content}
        components={{
          ToggleButtonItem,
          a: ExternalLink,
        }}
        options={{
          mdxOptions: {
            rehypePlugins: [[rehypePrettyCode], rehypeSlug],
          },
        }}
      />
    </section>
  );
}
