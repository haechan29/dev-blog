import * as InquiryThreadQueries from '@/features/inquiry/data/queries/inquiryThreadQueries';

export type InquiryThreadEntity = Awaited<
  ReturnType<typeof InquiryThreadQueries.fetchInquiryThreads>
>[number];
