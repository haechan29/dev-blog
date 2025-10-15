import Heading from '@/features/post/domain/model/heading';
import PostToolbar from '@/features/post/domain/model/postToolbar';

export type EmptyToolbarProps = {
  isVisible: boolean;
  mode: 'empty';
};
export type BasicToolbarProps = {
  isVisible: boolean;
  mode: 'basic';
  breadcrumb: string[];
  title: string;
};
export type CollapsedToolbarProps = {
  isVisible: boolean;
  mode: 'collapsed';
  breadcrumb: string[];
  title: string;
  headings: Heading[];
};
export type ExpandedToolbarProps = {
  isVisible: boolean;
  mode: 'expanded';
  breadcrumb: string[];
  title: string;
  headings: Heading[];
};

export type PostToolbarProps =
  | EmptyToolbarProps
  | BasicToolbarProps
  | CollapsedToolbarProps
  | ExpandedToolbarProps;

export function createProps({
  postToolbar,
  currentHeading,
}: {
  postToolbar: PostToolbar;
  currentHeading: Heading | null;
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
        currentHeading?.text,
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
        title: currentHeading!.text,
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
