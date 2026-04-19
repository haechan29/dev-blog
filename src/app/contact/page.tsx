import ContactPageClient from '@/components/contact/contactPageClient';
import * as InquiryServerRepository from '@/features/inquiry/data/repository/inquiryServerRepository';
import { toDto } from '@/features/inquiry/ui/mapper/inquiryThreadMapper';
import { getUserId } from '@/lib/user';

export default async function ContactPage() {
  const userId = await getUserId();

  const page = await InquiryServerRepository.getMyInquiryThreads({
    userId,
    cursorUpdatedAt: null,
    cursorId: null,
  }).then(page => ({
    ...page,
    threads: page.threads.map(toDto),
  }));

  return (
    <ContactPageClient
      initialThreads={page.threads}
      initialCursor={page.nextCursor}
    />
  );
}
