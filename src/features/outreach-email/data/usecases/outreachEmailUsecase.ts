import { NotFoundError } from '@/errors/errors';
import * as CreatorQueries from '@/features/creator/data/queries/creatorQueries';
import * as OutreachEmailQueries from '@/features/outreach-email/data/queries/outreachEmailQueries';
import {
  createRawEmail,
  fetchGmailMessage,
  fetchGmailMessages,
  parseGmailMessage,
  sendGmailMessage,
} from '@/lib/gmail';

export async function sendEmail({
  creatorId,
  subject,
  body,
  replyToEmailId,
}: {
  creatorId: string;
  subject: string;
  body: string;
  replyToEmailId?: string;
}): Promise<void> {
  const creator = await CreatorQueries.fetchCreator(creatorId);

  if (!creator) {
    throw new NotFoundError('크리에이터를 찾을 수 없습니다');
  }

  let replyTo: { threadId: string; messageId: string } | undefined;

  if (replyToEmailId) {
    const originalEmail =
      await OutreachEmailQueries.fetchOutreachEmail(replyToEmailId);
    if (originalEmail?.gmail_thread_id && originalEmail?.message_id) {
      replyTo = {
        threadId: originalEmail.gmail_thread_id,
        messageId: originalEmail.message_id,
      };
    }
  }

  const rawEmail = createRawEmail(
    creator.email,
    subject,
    body,
    replyTo ? { messageId: replyTo.messageId } : undefined
  );

  const result = await sendGmailMessage(rawEmail, replyTo?.threadId);

  await OutreachEmailQueries.createOutreachEmail({
    creatorId,
    gmailThreadId: result.threadId,
    gmailMessageId: result.id,
    messageId: null,
    direction: 'sent',
    subject,
    body,
    sentAt: new Date().toISOString(),
  });
}

export async function syncEmails(): Promise<{ synced: number }> {
  const afterTimestamp = await OutreachEmailQueries.fetchLastSyncTimestamp();
  const messages = await fetchGmailMessages(afterTimestamp);

  if (messages.length === 0) {
    return { synced: 0 };
  }

  const creators = await CreatorQueries.fetchCreators();
  if (creators.length === 0) {
    return { synced: 0 };
  }

  const creatorEmailMap = new Map(
    creators.map(c => [c.email.toLowerCase(), c.id])
  );

  let syncedCount = 0;

  for (const msg of messages) {
    const messageData = await fetchGmailMessage(msg.id);
    const parsed = parseGmailMessage(messageData, creatorEmailMap);

    if (!parsed) continue;

    try {
      await OutreachEmailQueries.createOutreachEmail(parsed);

      if (parsed.direction === 'received') {
        await CreatorQueries.updateLastReceivedAt(
          parsed.creatorId,
          parsed.sentAt
        );
      }

      syncedCount++;
    } catch (error) {
      const isUniqueViolation =
        error instanceof Error && error.message.includes('duplicate key');

      if (!isUniqueViolation) {
        throw error;
      }
    }
  }

  return { synced: syncedCount };
}
