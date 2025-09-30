import Heading from '@/features/post/domain/model/heading';
import PostToolbar from '@/features/post/domain/model/postToolbar';

export type EmptyToolbarProps = { mode: 'empty' };
export type MinimalToolbarProps = {
  mode: 'minimal';
  title: string | null;
};
export type BasicToolbarProps = {
  mode: 'basic';
  breadcrumb: string[];
  title: string;
};
export type CollapsedToolbarProps = {
  mode: 'collapsed';
  breadcrumb: string[];
  title: string;
  headings: Heading[];
};
export type ExpandedToolbarProps = {
  mode: 'expanded';
  breadcrumb: string[];
  title: string;
  headings: Heading[];
};

export type PostToolbarProps =
  | EmptyToolbarProps
  | MinimalToolbarProps
  | BasicToolbarProps
  | CollapsedToolbarProps
  | ExpandedToolbarProps;

export function createProps({
  postToolbar,
  selectedHeading,
}: {
  postToolbar: PostToolbar;
  selectedHeading: Heading | null;
}): PostToolbarProps {
  const mode = getMode(postToolbar);
  switch (mode) {
    case 'empty':
      return {
        mode,
      };
    case 'minimal':
      return {
        mode,
        title: postToolbar.tag,
      };
    case 'basic':
      return {
        mode,
        breadcrumb: postToolbar.tag ? [postToolbar.tag] : [],
        title: postToolbar.title!,
      };
    case 'collapsed': {
      const items = [
        postToolbar.tag,
        postToolbar.title!,
        selectedHeading?.text,
      ].filter(item => item != null);
      const lastItem = items.pop()!;
      return {
        mode,
        breadcrumb: items,
        title: lastItem,
        headings: postToolbar.headings,
      };
    }
    case 'expanded':
      return {
        mode,
        breadcrumb: postToolbar.tag
          ? [postToolbar.tag, postToolbar.title!]
          : [postToolbar.title!],
        title: selectedHeading!.text,
        headings: postToolbar.headings,
      };
  }
}

function getMode(postToolbar: PostToolbar): PostToolbarProps['mode'] {
  if (postToolbar.isInPostsPage) return 'minimal';
  else if (postToolbar.isHeaderVisible) return 'empty';
  else if (postToolbar.isContentVisible && postToolbar.isExpanded)
    return 'expanded';
  else if (postToolbar.isContentVisible && !postToolbar.isExpanded)
    return 'collapsed';
  else return 'basic';
}
