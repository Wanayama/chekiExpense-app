import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initFirebaseAdminApp } from './lib/firebase-admin';
import { auth } from 'firebase-admin';

initFirebaseAdminApp();

export async function middleware(request: NextRequest) {
  const session = cookies().get('session')?.value || '';

  if (!session) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return new Response('Unauthorized', { status: 401 });
    }
    if (request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/signup') {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    await auth().verifySessionCookie(session, true);
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return new Response('Unauthorized', { status: 401 });
    }
    if (request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/signup') {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/',
    '/expenses',
    '/login',
    '/signup',
    '/api/:path*',
  ],
};
