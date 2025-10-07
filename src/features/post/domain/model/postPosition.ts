import Heading from '@/features/post/domain/model/heading';
import {
  getHeadingsByPage,
  getPageByHeadingId,
  HeadingPageMapping,
} from '@/features/postViewer/domain/types/headingPageMapping';
import { Pagination } from '@/features/postViewer/domain/types/pagination';

export default interface PostPosition {
  currentHeading: Heading | null;
  pagination: Pagination | null;
  headingPageMapping: HeadingPageMapping | null;
}

export function syncPageWithHeading(postPosition: PostPosition) {
  const { currentHeading, pagination, headingPageMapping } = postPosition;
  if (!currentHeading || !headingPageMapping) return postPosition;

  const page = getPageByHeadingId(headingPageMapping, currentHeading.id);
  if (page === undefined) return postPosition;
  return {
    ...postPosition,
    pagination:
      pagination !== null
        ? {
            ...pagination,
            current: page,
          }
        : null,
  };
}

export function syncHeadingWithPage(postPosition: PostPosition) {
  const { pagination, headingPageMapping } = postPosition;
  if (!pagination || !headingPageMapping) return postPosition;

  const headings = getHeadingsByPage(headingPageMapping, pagination.current);
  if (!headings || headings.length === 0) return postPosition;
  return {
    ...postPosition,
    currentHeading: headings[0],
  };
}
