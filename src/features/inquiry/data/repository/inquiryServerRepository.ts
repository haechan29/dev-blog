import { toDomain } from '@/features/inquiry/data/mapper/inquiryMapper';
import * as InquiryQueries from '@/features/inquiry/data/queries/inquiryQueries';

export async function getInquiries() {
  const entites = await InquiryQueries.getInquiries();
  return entites.map(toDomain);
}
