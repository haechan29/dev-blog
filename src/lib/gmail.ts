import { supabase } from '@/lib/supabase';

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  internalDate: string;
  payload?: {
    headers?: { name: string; value: string }[];
    body?: { data?: string };
    parts?: GmailMessagePart[];
  };
}

interface GmailMessagePart {
  mimeType: string;
  body?: { data?: string };
  parts?: GmailMessagePart[];
}

export async function fetchGmailMessages(afterTimestamp: number | null) {
  const accessToken = await getValidAccessToken();
  const query = afterTimestamp ? `after:${afterTimestamp}` : '';

  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=100`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const result = await response.json();

  return result.messages ?? [];
}

export async function fetchGmailMessage(
  messageId: string
): Promise<GmailMessage> {
  const accessToken = await getValidAccessToken();

  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.json();
}

export function parseGmailMessage(
  msgData: GmailMessage,
  creatorEmailMap: Map<string, string>
) {
  const headers = msgData.payload?.headers ?? [];
  const from = headers.find(h => h.name === 'From')?.value ?? '';
  const to = headers.find(h => h.name === 'To')?.value ?? '';
  const subject = headers.find(h => h.name === 'Subject')?.value ?? '';
  const messageId = headers.find(h => h.name === 'Message-ID')?.value ?? null;

  const fromEmail = extractEmail(from).toLowerCase();
  const toEmail = extractEmail(to).toLowerCase();

  let creatorId: string | null = null;
  let direction: 'sent' | 'received' | null = null;

  if (creatorEmailMap.has(toEmail)) {
    creatorId = creatorEmailMap.get(toEmail)!;
    direction = 'sent';
  } else if (creatorEmailMap.has(fromEmail)) {
    creatorId = creatorEmailMap.get(fromEmail)!;
    direction = 'received';
  }

  if (!creatorId || !direction) return null;

  return {
    creatorId,
    gmailThreadId: msgData.threadId,
    gmailMessageId: msgData.id,
    direction,
    subject,
    messageId,
    body: extractBody(msgData.payload),
    sentAt: new Date(parseInt(msgData.internalDate)).toISOString(),
  };
}

export function createRawEmail(
  to: string,
  subject: string,
  body: string,
  replyTo?: { messageId: string }
) {
  const headers = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
  ];

  if (replyTo?.messageId) {
    headers.push(`In-Reply-To: ${replyTo.messageId}`);
    headers.push(`References: ${replyTo.messageId}`);
  }

  const email = [...headers, '', body].join('\r\n');

  return Buffer.from(email).toString('base64url');
}

export async function sendGmailMessage(
  rawEmail: string,
  threadId?: string
): Promise<string> {
  const accessToken = await getValidAccessToken();

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: rawEmail,
        ...(threadId && { threadId }),
      }),
    }
  );

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.id;
}

function extractEmail(str: string): string {
  const match = str.match(/<(.+?)>/) || str.match(/([^\s]+@[^\s]+)/);
  return match ? match[1] : str;
}

function extractBody(payload: GmailMessage['payload']): string {
  if (!payload) return '';

  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    }
    for (const part of payload.parts) {
      const result = extractBody(part);
      if (result) return result;
    }
  }

  return '';
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
