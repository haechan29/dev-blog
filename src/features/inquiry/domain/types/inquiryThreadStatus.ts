export const INQUIRY_THREAD_STATUSES = [
  'AWAITING_REPLY',
  'ANSWERED',
  'CLOSED',
] as const;

export type InquiryThreadStatus = (typeof INQUIRY_THREAD_STATUSES)[number];

export function isInquiryThreadStatus(
  value: string
): value is InquiryThreadStatus {
  return (INQUIRY_THREAD_STATUSES as readonly string[]).includes(value);
}
