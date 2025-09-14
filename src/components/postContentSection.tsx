import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import ToggleButtonItem from '@/components/toggleButtonItem';
import { ReactNode } from 'react';
import { PostItemProps } from '@/features/post/ui/postItemProps';

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
