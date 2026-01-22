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
