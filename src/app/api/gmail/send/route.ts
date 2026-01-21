import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { creatorId, subject, body } = await request.json();

    if (!creatorId || !subject || !body) {
      return NextResponse.json(
        { error: '크리에이터 ID, 제목, 내용이 필요합니다' },
        { status: 400 }
      );
    }

    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('email')
      .eq('id', creatorId)
      .single();

    if (creatorError || !creator) {
      return NextResponse.json(
        { error: '크리에이터를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const accessToken = await getValidAccessToken();
    const rawEmail = createEmail(creator.email, subject, body);

    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: rawEmail }),
      }
    );

    const result = await response.json();

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from('outreach_emails')
      .insert({
        creator_id: creatorId,
        subject,
        body,
        status: 'sent',
      });

    if (insertError) {
      console.error('발송 이력 저장 실패:', insertError);
    }

    return NextResponse.json({ success: true, messageId: result.id });
  } catch (error) {
    console.error('메일 발송 실패:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '메일 발송 실패' },
      { status: 500 }
    );
  }
}

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID!,
      client_secret: process.env.GMAIL_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  return response.json();
}

async function getValidAccessToken() {
  const { data: tokens, error } = await supabase
    .from('gmail_tokens')
    .select('*')
    .eq('id', 'default')
    .single();

  if (error || !tokens) {
    throw new Error('Gmail 토큰이 없습니다. 먼저 연동해주세요.');
  }

  const now = new Date();
  const expiresAt = new Date(tokens.expires_at);

  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    const newTokens = await refreshAccessToken(tokens.refresh_token);

    if (newTokens.error) {
      throw new Error('토큰 갱신 실패: ' + newTokens.error);
    }

    const newExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000);

    await supabase
      .from('gmail_tokens')
      .update({
        access_token: newTokens.access_token,
        expires_at: newExpiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'default');

    return newTokens.access_token;
  }

  return tokens.access_token;
}

function createEmail(to: string, subject: string, body: string) {
  const email = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    '',
    body,
  ].join('\r\n');

  return Buffer.from(email).toString('base64url');
}
