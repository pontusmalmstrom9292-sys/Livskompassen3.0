import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0481875058',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

export const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app, 'europe-west1');
