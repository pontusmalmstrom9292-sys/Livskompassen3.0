import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { googleRedirectBoot } from './modules/core/firebase/authRedirectBoot';
import { applyDefaultTheme } from './modules/core/theme';
import { initAppCheck } from './modules/core/firebase/appCheck';
import { initCapacitorShellChrome } from './modules/core/platform/capacitorShellChrome';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';

applyDefaultTheme();
initCapacitorShellChrome();

console.log("Starting boot"); void googleRedirectBoot.finally(() => {
  // SW efter redirect-hantering — undvik reload mitt i Google OAuth.
  registerSW({ immediate: true });

  void initAppCheck().finally(() => {
    console.log("App Check finished, calling createRoot...");
    try {
      createRoot(document.getElementById('root')!).render(
        <StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StrictMode>,
      );
      console.log("createRoot.render() executed successfully");
    } catch (err) {
      console.error("createRoot.render() threw an error:", err);
    }
  });
});
