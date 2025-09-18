import { Heading } from '@/features/post/domain/model/post';

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
