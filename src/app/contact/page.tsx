import { auth } from '@/auth';
import ContactPageClient from '@/components/contact/contactPageClient';
import * as InquiryServerRepository from '@/features/inquiry/data/repository/inquiryServerRepository';
import { toDto } from '@/features/inquiry/ui/mapper/inquiryThreadMapper';
import { getUserId } from '@/lib/user';

export default async function ContactPage() {
  const session = await auth();
  const userId = await getUserId();

  const page = await InquiryServerRepository.getMyInquiryThreads({
    userId,
    cursorUpdatedAt: null,
    cursorId: null,
  }).then(page => {
    return {
      ...page,
      threads: page.threads.map(toDto),
    };
  });

  return (
    <ContactPageClient
      isLoggedIn={!!session}
      initialThreads={page.threads}
      initialCursor={page.nextCursor}
    />
  );
}
