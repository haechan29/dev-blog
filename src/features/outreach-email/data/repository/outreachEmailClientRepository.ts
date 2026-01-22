import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';
import { api } from '@/lib/api';

export async function getOutreachEmails(
  creatorId?: string
): Promise<OutreachEmail[]> {
  const params = creatorId ? `?creatorId=${creatorId}` : '';
  const response = await api.get(`/api/outreach-emails${params}`);
  return response.data;
}

export async function sendOutreachEmail({
  creatorId,
  subject,
  body,
}: {
  creatorId: string;
  subject: string;
  body: string;
}): Promise<void> {
  await api.post('/api/outreach-emails', { creatorId, subject, body });
}
