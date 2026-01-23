import * as OutreachEmailQueries from '@/features/outreach-email/data/queries/outreachEmailQueries';
import * as OutreachEmailUsecase from '@/features/outreach-email/data/usecases/outreachEmailUsecase';
import 'server-only';

export async function sendEmail(params: {
  creatorId: string;
  subject: string;
  body: string;
  replyToEmailId?: string;
}) {
  await OutreachEmailUsecase.sendEmail(params);
}

export async function markAsRead(id: string) {
  await OutreachEmailQueries.markAsRead(id);
}

export async function syncEmails() {
  return await OutreachEmailUsecase.syncEmails();
}
