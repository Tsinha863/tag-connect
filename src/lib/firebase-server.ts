import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// This file is for server-side use only.

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  if (!getApps().length) {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // For local development or environments without the service account key env var,
      // it will try to use Application Default Credentials.
      admin.initializeApp();
    }
  }
} catch (e) {
  console.error('Firebase Admin initialization error:', e);
}


const serverFirestore = admin.firestore();
export { serverFirestore };
