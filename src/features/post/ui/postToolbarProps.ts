import Heading from '@/features/post/domain/model/heading';

export type EmptyToolbarProps = {
  mode: 'empty';
  breadcrumb?: string;
};
export type BasicToolbarProps = {
  mode: 'basic';
  breadcrumb?: string;
  title: string;
};
export type CollapsedToolbarProps = {
  mode: 'collapsed';
  breadcrumb?: string;
  title: string;
  headings: Heading[];
};
export type ExpandedToolbarProps = {
  mode: 'expanded';
  breadcrumb?: string;
  title: string;
  headings: Heading[];
};

export type PostToolbarProps =
  | EmptyToolbarProps
  | BasicToolbarProps
  | CollapsedToolbarProps
  | ExpandedToolbarProps;
