import InquiryThreadPageClient from '@/components/contact/inquiryThreadPageClient';

export default async function InquiryThreadPage({
  params,
}: {
  params: Promise<{ inquiryThreadId: string }>;
}) {
  const { inquiryThreadId } = await params;

  return <InquiryThreadPageClient inquiryThreadId={inquiryThreadId} />;
}
