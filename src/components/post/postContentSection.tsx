import ContentSectionDetector from '@/components/post/contentSectionDetector';
import PostSummarySection from '@/components/post/postSummarySection';
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

export default function PostContentSection({ post }: { post: PostItemProps }) {
  return (
    <section className='prose mb-20'>
      <ContentSectionDetector />
      <MDXRemote
        source={post.content}
        components={{
          PostSummarySection,
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
