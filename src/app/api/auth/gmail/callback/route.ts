import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const redirectUri =
    process.env.NODE_ENV === 'production'
      ? 'https://sharetext.app/api/auth/gmail/callback'
      : 'http://localhost:3000/api/auth/gmail/callback';

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GMAIL_CLIENT_ID!,
      client_secret: process.env.GMAIL_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();

  if (tokens.error) {
    return NextResponse.json({ error: tokens.error }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  const { error } = await supabase.from('gmail_tokens').upsert({
    id: 'default',
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: expiresAt.toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to save tokens' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: 'Gmail 연동 완료' });
}
