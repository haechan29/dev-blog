import Heading from '@/features/post/domain/model/heading';

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
