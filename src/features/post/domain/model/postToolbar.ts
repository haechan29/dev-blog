import { Heading } from '@/features/post/domain/model/post';
import { PostToolbarProps } from '@/features/post/ui/postToolbarProps';

export type PostToolbarMode =
  | 'empty'
  | 'minimal'
  | 'basic'
  | 'collapsed'
  | 'expanded';

export default interface PostToolbar {
  tag: string | null;
  selectedHeading: Heading | null;
  isInPostsPage: boolean;
  isHeaderVisible: boolean;
  isContentVisible: boolean;
  isExpanded: boolean;
  headings: Heading[];
  title?: string;
}

export function toProps(postToolbar: PostToolbar): PostToolbarProps {
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
        postToolbar.selectedHeading?.text,
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
        title: postToolbar.selectedHeading!.text,
        headings: postToolbar.headings,
      };
  }
}

function getMode(postToolbar: PostToolbar): PostToolbarMode {
  if (postToolbar.isInPostsPage) return 'minimal';
  else if (postToolbar.isHeaderVisible) return 'empty';
  else if (postToolbar.isContentVisible && postToolbar.isExpanded)
    return 'expanded';
  else if (postToolbar.isContentVisible && !postToolbar.isExpanded)
    return 'collapsed';
  else return 'basic';
}
