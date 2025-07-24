import { auth } from 'firebase-admin';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdminApp } from '@/lib/firebase-admin';

initFirebaseAdminApp();

export async function GET(request: NextRequest) {
  const headersList = headers();
  if ((await headersList).get('x-internal-request') !== 'true') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const session = request.nextUrl.searchParams.get('session');

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  try {
    const decodedClaims = await auth().verifySessionCookie(session, true);
    return NextResponse.json({ isLogged: true, user: decodedClaims }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
}
