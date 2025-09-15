import { Heading } from '@/features/post/domain/model/post';

export type EmptyToolbarProps = { type: 'empty' };
export type BasicToolbarProps = {
  type: 'basic';
  breadcrumb: string[];
  title: string;
};
export type CollapsedToolbarProps = {
  type: 'collapsed';
  breadcrumb: string[];
  title: string;
};
export type ExpandedToolbarProps = {
  type: 'expanded';
  breadcrumb: string[];
  title: string;
  selectedHeading: Heading | null;
  headings: Heading[];
};

export type PostToolbarProps =
  | EmptyToolbarProps
  | BasicToolbarProps
  | CollapsedToolbarProps
  | ExpandedToolbarProps;
