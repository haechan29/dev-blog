'use client';

import PostReader from '@/features/post/domain/model/postReader';
import PostToolbar from '@/features/post/domain/model/postToolbar';
import { PostToolbarProps } from '@/features/post/ui/postToolbarProps';
import { RootState } from '@/lib/redux/store';
import { useSelector } from 'react-redux';

export default function usePostToolbar() {
  const postToolbar = useSelector((state: RootState) => state.postToolbar);
  const postReader = useSelector((state: RootState) => state.postReader);
  return createProps({ postToolbar, postReader });
}

function createProps({
  postToolbar,
  postReader,
}: {
  postToolbar: PostToolbar;
  postReader: PostReader;
}): PostToolbarProps {
  const mode = getMode(postToolbar);
  switch (mode) {
    case 'empty':
      return {
        mode,
      };
    case 'basic':
      return {
        mode,
        title: postToolbar.title!,
      };
    case 'collapsed': {
      const title = postToolbar.title!;
      const headingText = postReader.currentHeading?.textContent;
      return {
        mode,
        breadcrumb: headingText ? title : undefined,
        title: headingText ?? title,
        headings: postToolbar.headings,
      };
    }
    case 'expanded':
      return {
        mode,
        breadcrumb: postToolbar.title!,
        title: postReader.currentHeading!.textContent,
        headings: postToolbar.headings,
      };
  }
}

function getMode(postToolbar: PostToolbar): PostToolbarProps['mode'] {
  if (postToolbar.isHeaderVisible) {
    return 'empty';
  } else if (postToolbar.headings.length > 0 && postToolbar.isExpanded) {
    return 'expanded';
  } else if (postToolbar.headings.length > 0 && !postToolbar.isExpanded) {
    return 'collapsed';
  } else {
    return 'basic';
  }
}
