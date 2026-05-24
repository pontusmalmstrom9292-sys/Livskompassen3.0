import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Prod APK: CAPACITOR_SERVER_URL=https://gen-lang-client-0481875058.web.app npm run cap:sync:prod
 * WebView loads live Hosting UI after push to main; native widgets stay in APK.
 */
const prodServerUrl = process.env.CAPACITOR_SERVER_URL?.trim();

/** Native Android/iOS shell — widgets deep-link into WebView routes under /widget/* */
const config: CapacitorConfig = {
  appId: 'com.livskompassen.app',
  appName: 'Livskompassen',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: 'https',
    ...(prodServerUrl ? { url: prodServerUrl, cleartext: false } : {}),
  },
};

export default config;
