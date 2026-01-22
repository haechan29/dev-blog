import * as CreatorQueries from '@/features/creator/data/queries/creatorQueries';
import * as OutreachEmailQueries from '@/features/outreach-email/data/queries/outreachEmailQueries';
import {
  fetchGmailMessage,
  fetchGmailMessages,
  parseGmailMessage,
} from '@/lib/gmail';

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
