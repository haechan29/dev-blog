import { db } from '@/db/index';
import { outreachEmails } from '@/db/schema';
import { NotFoundError } from '@/errors/errors';
import { and, desc, eq, sql } from 'drizzle-orm';
import 'server-only';

const OUTREACH_EMAIL_SELECT_FIELDS = {
  id: outreachEmails.id,
  creatorId: outreachEmails.creatorId,
  gmailThreadId: outreachEmails.gmailThreadId,
  gmailMessageId: outreachEmails.gmailMessageId,
  messageId: outreachEmails.messageId,
  direction: outreachEmails.direction,
  subject: outreachEmails.subject,
  body: outreachEmails.body,
  sentAt: outreachEmails.sentAt,
  isRead: outreachEmails.isRead,
} as const;

export async function fetchOutreachEmails(creatorId?: string) {
  const where = creatorId ? eq(outreachEmails.creatorId, creatorId) : undefined;

  return await db
    .select(OUTREACH_EMAIL_SELECT_FIELDS)
    .from(outreachEmails)
    .where(where)
    .orderBy(desc(outreachEmails.sentAt));
}

export async function fetchOutreachEmail(id: string) {
  const data = await db
    .select(OUTREACH_EMAIL_SELECT_FIELDS)
    .from(outreachEmails)
    .where(eq(outreachEmails.id, id))
    .limit(1);

  if (!data[0]) {
    throw new NotFoundError('아웃리치 이메일을 찾을 수 없습니다');
  }

  return data[0];
}

export async function createOutreachEmail({
  creatorId,
  gmailThreadId,
  gmailMessageId,
  messageId,
  direction,
  subject,
  body,
  sentAt,
}: {
  creatorId: string;
  gmailThreadId: string | null;
  gmailMessageId: string | null;
  messageId: string | null;
  direction: 'sent' | 'received';
  subject: string;
  body: string;
  sentAt: string;
}) {
  const [email] = await db
    .insert(outreachEmails)
    .values({
      creatorId,
      gmailThreadId,
      gmailMessageId,
      messageId,
      direction,
      subject,
      body,
      sentAt,
    })
    .returning(OUTREACH_EMAIL_SELECT_FIELDS);

  if (!email) {
    throw new Error('아웃리치 이메일 생성에 실패했습니다');
  }

  return email;
}

export async function deleteOutreachEmail(id: string) {
  await db.delete(outreachEmails).where(eq(outreachEmails.id, id));
}

export async function fetchUnreadCounts(): Promise<Record<string, number>> {
  const data = await db
    .select({
      creatorId: outreachEmails.creatorId,
      count: sql<number>`count(*)::int`,
    })
    .from(outreachEmails)
    .where(
      and(
        eq(outreachEmails.isRead, false),
        eq(outreachEmails.direction, 'received')
      )
    )
    .groupBy(outreachEmails.creatorId);

  return Object.fromEntries(data.map(row => [row.creatorId, row.count]));
}

export async function markAsRead(id: string) {
  await db
    .update(outreachEmails)
    .set({ isRead: true })
    .where(eq(outreachEmails.id, id));
}

export async function fetchLastSyncTimestamp(): Promise<number | null> {
  const data = await db
    .select({
      sentAt: outreachEmails.sentAt,
    })
    .from(outreachEmails)
    .orderBy(desc(outreachEmails.sentAt))
    .limit(1);

  return data[0] ? Math.floor(new Date(data[0].sentAt).getTime() / 1000) : null;
}
