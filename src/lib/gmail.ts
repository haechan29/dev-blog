import { supabase } from '@/lib/supabase';

export async function getValidAccessToken() {
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
