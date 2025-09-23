import HideFullscreen from '@/components/post//hideFullscreen';
import PostSummarySection from '@/components/post/postSummarySection';
import ToggleButtonItem from '@/components/post/toggleButtonItem';
import { ReactNode } from 'react';

const ExternalLink = ({ children, ...props }: { children: ReactNode }) => {
  return (
    <a rel='noopener noreferrer' target='_blank' {...props}>
      {children}
    </a>
  );
};

export const compoenents = {
  PostSummarySection,
  ToggleButtonItem,
  HideFullscreen,
  a: ExternalLink,
};
