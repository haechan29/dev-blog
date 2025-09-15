import { Heading } from '@/features/post/domain/model/post';

export type EmptyToolbarProps = { type: 'empty' };
export type MinimalToolbarProps = {
  type: 'minimal';
  title: string | null;
};
export type BasicToolbarProps = {
  type: 'basic';
  breadcrumb: string[];
  title: string;
};
export type CollapsedToolbarProps = {
  type: 'collapsed';
  breadcrumb: string[];
  title: string;
  headings: Heading[];
};
export type ExpandedToolbarProps = {
  type: 'expanded';
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
