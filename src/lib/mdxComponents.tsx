import Caption from '@/components/mdx/caption';
import HideFullscreen from '@/components/mdx/hideFullscreen';
import Paged from '@/components/mdx/paged';
import PostSummarySection from '@/components/post/postSummarySection';
import { ReactNode } from 'react';

const ExternalLink = ({ children, ...props }: { children: ReactNode }) => {
  return (
    <a rel='noopener noreferrer' target='_blank' {...props}>
      {children}
    </a>
  );
};

export const components = {
  PostSummarySection,
  HideFullscreen,
  Paged,
  Caption,
  a: ExternalLink,
};
