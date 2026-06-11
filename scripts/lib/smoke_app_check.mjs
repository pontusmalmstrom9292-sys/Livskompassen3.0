/**
 * Shared App Check debug init for prod callable smokes.
 */
import { initializeAppCheck, CustomProvider } from 'firebase/app-check';

/** @param {import('firebase/app').FirebaseApp} app */
export function initSmokeAppCheck(app, env) {
  const debugToken = env.VITE_APP_CHECK_DEBUG_TOKEN;
  const appId = env.VITE_FIREBASE_APP_ID;
  const projectNumber = env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const apiKey = env.VITE_FIREBASE_API_KEY;
  if (!debugToken || !appId || !projectNumber || !apiKey) return false;

  const exchangeUrl = `https://firebaseappcheck.googleapis.com/v1/projects/${projectNumber}/apps/${appId}:exchangeDebugToken?key=${encodeURIComponent(apiKey)}`;
  initializeAppCheck(app, {
    provider: new CustomProvider({
      getToken: async () => {
        const res = await fetch(exchangeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Firebase-AppCheck': debugToken },
          body: JSON.stringify({ debugToken, limitedUse: false }),
        });
        if (!res.ok) {
          throw new Error(`App Check exchangeDebugToken ${res.status}: ${await res.text()}`);
        }
        const data = await res.json();
        return {
          token: data.token,
          expireTimeMillis: data.ttl
            ? Date.now() + Number.parseInt(String(data.ttl).replace('s', ''), 10) * 1000
            : Date.now() + 3_600_000,
        };
      },
    }),
    isTokenAutoRefreshEnabled: true,
  });
  return true;
}
