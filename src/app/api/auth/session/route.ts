import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdminApp } from '@/lib/firebase-admin';

initFirebaseAdminApp();

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const expiresIn = 60 * 60 * 24 * 2 * 1000; // 48 hours

    try {
      const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });
      cookies().set('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });
      return NextResponse.json({ status: 'success' });
    } catch (error) {
      console.error('Error creating session cookie', error);
      return NextResponse.json({ status: 'error' }, { status: 401 });
    }
  }
  return NextResponse.json({ status: 'error' }, { status: 400 });
}

export async function DELETE() {
  cookies().delete('session');
  return NextResponse.json({ status: 'success' });
}
