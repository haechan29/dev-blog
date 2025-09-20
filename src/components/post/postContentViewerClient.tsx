'use client';

import PostSummarySection from '@/components/post/postSummarySection';
import ToggleButtonItem from '@/components/post/toggleButtonItem';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const MDXRemoteClient = dynamic(
  () => import('next-mdx-remote').then(module => module.MDXRemote),
  { ssr: false }
);

export default function PostContentViewerClient({
  mdxSource,
}: {
  mdxSource: MDXRemoteSerializeResult;
}) {
  const ExternalLink = ({ children, ...props }: { children: ReactNode }) => {
    return (
      <a rel='noopener noreferrer' target='_blank' {...props}>
        {children}
      </a>
    );
  };

  return (
    <MDXRemoteClient
      {...mdxSource}
      components={{
        PostSummarySection,
        ToggleButtonItem,
        a: ExternalLink,
      }}
    />
  );
}
