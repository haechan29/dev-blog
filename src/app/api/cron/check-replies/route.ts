import { getValidAccessToken } from '@/lib/gmail';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'CRON_SECRET이 일치하지 않습니다' },
      { status: 401 }
    );
  }

  try {
    const { data: pendingEmails, error: fetchError } = await supabase
      .from('outreach_emails')
      .select('id, creator_id, sent_at, creators(email)')
      .eq('status', 'sent');

    if (fetchError) {
      throw fetchError;
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return NextResponse.json({ updated: 0 });
    }

    let updatedCount = 0;

    for (const email of pendingEmails) {
      const creators = email.creators as unknown as { email: string } | null;
      const creatorEmail = creators?.email;
      if (!creatorEmail) continue;

      const hasReply = await hasReceivedEmailFrom(
        creatorEmail,
        new Date(email.sent_at)
      );

      if (hasReply) {
        await supabase
          .from('outreach_emails')
          .update({
            status: 'responded',
            responded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', email.id);

        updatedCount++;
      }
    }

    return NextResponse.json({ updated: updatedCount });
  } catch (error) {
    console.error('답장 체크에 실패했습니다', error);

    return NextResponse.json(
      { error: '답장 체크에 실패했습니다' },
      { status: 500 }
    );
  }
}

async function hasReceivedEmailFrom(email: string, afterDate: Date) {
  const accessToken = await getValidAccessToken();
  const after = Math.floor(afterDate.getTime() / 1000);

  const query = `from:${email} after:${after}`;
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const result = await response.json();

  if (result.error) {
    console.error(`Gmail API 오류 (${email}):`, result.error);
    return false;
  }

  return result.messages && result.messages.length > 0;
}
