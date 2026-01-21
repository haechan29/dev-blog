import { toDto } from '@/features/outreach-email/data/mapper/outreachEmailMapper';
import * as OutreachEmailQueries from '@/features/outreach-email/data/queries/outreachEmailQueries';
import 'server-only';

export async function getOutreachEmails(creatorId?: string) {
  const emails = await OutreachEmailQueries.fetchOutreachEmails(creatorId);
  return emails.map(toDto);
}

export async function getOutreachEmail(id: string) {
  const email = await OutreachEmailQueries.fetchOutreachEmail(id);
  return email ? toDto(email) : null;
}

export async function createOutreachEmail(params: {
  creatorId: string;
  subject: string;
  body: string;
}) {
  const email = await OutreachEmailQueries.createOutreachEmail(params);
  return toDto(email);
}

export async function updateOutreachEmail(params: {
  id: string;
  subject?: string;
  body?: string;
  status?: 'sent' | 'responded';
  respondedAt?: string | null;
}) {
  const email = await OutreachEmailQueries.updateOutreachEmail(params);
  return toDto(email);
}

export async function deleteOutreachEmail(id: string) {
  await OutreachEmailQueries.deleteOutreachEmail(id);
}
