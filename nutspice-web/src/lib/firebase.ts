import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app;
let auth: any = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Disable app verification for local testing (Requires setting up a Test Phone Number in Firebase Console)
  if (process.env.NODE_ENV === "development") {
    auth.settings.appVerificationDisabledForTesting = true;
  }
} else {
  // Mock/Dummy auth settings to prevent client-side load crashes
  auth = {
    settings: {},
    isMock: true,
  };
}

export { auth, isFirebaseConfigured };
