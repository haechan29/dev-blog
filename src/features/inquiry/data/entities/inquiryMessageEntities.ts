import * as InquiryMessageQueries from '@/features/inquiry/data/queries/inquiryMessageQueries';

export type InquiryMessageEntity = Awaited<
  ReturnType<typeof InquiryMessageQueries.fetchInquiryMessagesByThreadId>
>[number];
