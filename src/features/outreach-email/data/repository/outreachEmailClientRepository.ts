import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';
import { api } from '@/lib/api';

export async function getOutreachEmails(
  creatorId?: string
): Promise<OutreachEmail[]> {
  const params = creatorId ? `?creatorId=${creatorId}` : '';
  const response = await api.get(`/api/outreach-emails${params}`);
  return response.data;
}

export async function getUnreadCounts(): Promise<Record<string, number>> {
  const response = await api.get('/api/outreach-emails/unread-counts');
  return response.data;
}
