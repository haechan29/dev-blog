export interface HeadingItemProps {
  id: string;
  text: string;
  level: number;
  isSelected: boolean;
}

export interface PostToolbarProps {
  breadcrumb: string[];
  headings: HeadingItemProps[];
  isContentVisible: boolean;
  isExpanded: boolean;
}
