import * as OutreachEmailQueries from '@/features/outreach-email/data/queries/outreachEmailQueries';

export type OutreachEmailEntity = Awaited<
  ReturnType<typeof OutreachEmailQueries.fetchOutreachEmails>
>[number];
