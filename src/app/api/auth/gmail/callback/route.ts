import {
  ApiError,
  ExternalServiceError,
  ValidationError,
} from '@/errors/errors';
import * as GmailTokenQueries from '@/features/gmail/data/queries/gmailTokenQueries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    if (!code) {
      throw new ValidationError('인증 코드가 없습니다');
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
      const detail =
        typeof tokens.error === 'string'
          ? tokens.error
          : 'Google 토큰 교환에 실패했습니다';
      throw new ExternalServiceError(detail);
    }

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    await GmailTokenQueries.upsertGmailTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAtIso: expiresAt.toISOString(),
    });

    return NextResponse.json({
      data: { message: 'Gmail 연동 완료' },
    });
  } catch (error) {
    console.error('Gmail OAuth 콜백 처리에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: 'Gmail OAuth 콜백 처리에 실패했습니다' },
      { status: 500 }
    );
  }
}
