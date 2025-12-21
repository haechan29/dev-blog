import { Page } from '@/features/postViewer/domain/types/page';

export default interface PostViewerProps {
  isViewerMode: boolean;
  areBarsVisible: boolean;
  isToolbarExpanded: boolean;
  pageNumber: number | null;
  totalPages: number | null;
  page?: Page;
}
