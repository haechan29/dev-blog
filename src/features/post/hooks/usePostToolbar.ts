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
        isVisible: !postToolbar.isScrollingDown,
        mode,
      };
    case 'basic':
      return {
        isVisible: !postToolbar.isScrollingDown,
        mode,
        breadcrumb: postToolbar.tag ? [postToolbar.tag] : [],
        title: postToolbar.title!,
      };
    case 'collapsed': {
      const items = [
        postToolbar.tag,
        postToolbar.title!,
        postReader.currentHeading?.text,
      ].filter(item => item != null);
      const lastItem = items.pop()!;
      return {
        isVisible: !postToolbar.isScrollingDown,
        mode,
        breadcrumb: items,
        title: lastItem,
        headings: postToolbar.headings,
      };
    }
    case 'expanded':
      return {
        isVisible: !postToolbar.isScrollingDown,
        mode,
        breadcrumb: postToolbar.tag
          ? [postToolbar.tag, postToolbar.title!]
          : [postToolbar.title!],
        title: postReader.currentHeading!.text,
        headings: postToolbar.headings,
      };
  }
}

function getMode(postToolbar: PostToolbar): PostToolbarProps['mode'] {
  if (postToolbar.isHeaderVisible) return 'empty';
  else if (postToolbar.isContentVisible && postToolbar.isExpanded)
    return 'expanded';
  else if (postToolbar.isContentVisible && !postToolbar.isExpanded)
    return 'collapsed';
  else return 'basic';
}
