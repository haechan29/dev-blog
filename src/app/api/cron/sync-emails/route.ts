import { ApiError, UnauthorizedError } from '@/errors/errors';
import * as CreatorQueries from '@/features/creator/data/queries/creatorQueries';
import * as OutreachEmailQueries from '@/features/outreach-email/data/queries/outreachEmailQueries';
import {
  fetchGmailMessage,
  fetchGmailMessages,
  parseGmailMessage,
} from '@/lib/gmail';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new UnauthorizedError('CRON_SECRET이 일치하지 않습니다');
    }

    const afterTimestamp = await OutreachEmailQueries.fetchLastSyncTimestamp();
    const messages = await fetchGmailMessages(afterTimestamp);

    if (messages.length === 0) {
      return NextResponse.json({ data: { synced: 0 } });
    }

    const creators = await CreatorQueries.fetchCreators();
    if (creators.length === 0) {
      return NextResponse.json({ data: { synced: 0 } });
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

        // ignore messages that breaks unique constraint (messages that already has been stored)
        if (!isUniqueViolation) {
          throw error;
        }
      }
    }

    return NextResponse.json({ data: { synced: syncedCount } });
  } catch (error) {
    console.error('이메일 동기화에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '이메일 동기화에 실패했습니다' },
      { status: 500 }
    );
  }
}
