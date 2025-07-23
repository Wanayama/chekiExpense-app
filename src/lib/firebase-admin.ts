import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';

let app: App;

export function initFirebaseAdminApp() {
  if (getApps().length === 0) {
    app = initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    app = getApps()[0];
  }
  return { app, auth: getAuth(app) };
}
