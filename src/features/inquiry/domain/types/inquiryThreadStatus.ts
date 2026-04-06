export const INQUIRY_THREAD_STATUSES = [
  'AWAITING_REPLY',
  'ANSWERED',
  'CLOSED',
] as const;

export type InquiryThreadStatus = (typeof INQUIRY_THREAD_STATUSES)[number];
