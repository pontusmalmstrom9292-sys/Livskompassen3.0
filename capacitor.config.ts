import type { CapacitorConfig } from '@capacitor/cli';

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
  },
};

export default config;
