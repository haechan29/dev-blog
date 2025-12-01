import { auth } from '@/auth';
import { nanoid } from 'nanoid';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let response: NextResponse;

  if (request.nextUrl.pathname.startsWith('/@')) {
    const userId = request.nextUrl.pathname.slice(2);
    response = NextResponse.rewrite(new URL(`/user/${userId}`, request.url));
  } else {
    response = NextResponse.next();
  }

  const session = await auth();
  if (session) return response;

  const guestId = request.cookies.get('guestId')?.value ?? nanoid();
  response.cookies.set('guestId', guestId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
