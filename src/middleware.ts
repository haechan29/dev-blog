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

  return response;
}
