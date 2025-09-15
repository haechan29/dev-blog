import { Heading } from '@/features/post/domain/model/post';
import { PostToolbarProps } from '@/features/post/ui/postToolbarProps';

export default interface PostToolbar {
  type: 'empty' | 'minimal' | 'basic' | 'collapsed' | 'expanded';
  tag: string | null;
  selectedHeading: Heading | null;
  headings: Heading[];
  title?: string;
}

export function toProps(postToolbar: PostToolbar): PostToolbarProps {
  switch (postToolbar.type) {
    case 'empty':
      return {
        type: postToolbar.type,
      };
    case 'minimal':
      return {
        type: postToolbar.type,
        title: postToolbar.tag,
      };
    case 'basic':
      return {
        type: postToolbar.type,
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
        type: postToolbar.type,
        breadcrumb: items,
        title: lastItem,
      };
    }
    case 'expanded':
      return {
        type: postToolbar.type,
        breadcrumb: postToolbar.tag
          ? [postToolbar.tag, postToolbar.title!]
          : [postToolbar.title!],
        title: postToolbar.selectedHeading!.text,
        selectedHeading: postToolbar.selectedHeading,
        headings: postToolbar.headings,
      };
  }
}
