import PostContentViewer from '@/components/post/postContentViewer';
import PostSummarySection from '@/components/post/postSummarySection';
import ToggleButtonItem from '@/components/post/toggleButtonItem';
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

export default function PostContentSection({ content }: { content: string }) {
  return (
    <section className='mb-20'>
      <div className='prose'>
        <MDXRemote
          source={content}
          components={{
            PostSummarySection,
            ToggleButtonItem,
            a: ExternalLink,
          }}
          options={{
            mdxOptions: {
              rehypePlugins: [rehypePrettyCode, rehypeSlug],
            },
          }}
        />
      </div>

      <PostContentViewer />
    </section>
  );
}
