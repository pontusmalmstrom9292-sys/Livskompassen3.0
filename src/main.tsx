import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './widgets/companion-widgets.css';
import { googleRedirectBoot } from './modules/core/firebase/authRedirectBoot';
import { applyDefaultTheme } from './modules/core/theme';
import { initAppCheck } from './modules/core/firebase/appCheck';
import { initCapacitorShellChrome } from './modules/core/platform/capacitorShellChrome';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';

applyDefaultTheme();
initCapacitorShellChrome();

const BOOT_MOUNT_DEADLINE_MS = 10_000;

function mountApp() {
  console.log('Boot deadline reached — mounting React…');
  try {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
    console.log('createRoot.render() executed successfully');
  } catch (err) {
    console.error('createRoot.render() threw an error:', err);
  }
}

console.log('Starting boot');
void googleRedirectBoot.finally(() => {
  registerSW({ immediate: true });

  const appCheck = initAppCheck().catch((err) => {
    console.warn('[boot] initAppCheck failed', err);
  });
  const deadline = new Promise<void>((resolve) => {
    setTimeout(resolve, BOOT_MOUNT_DEADLINE_MS);
  });
  void Promise.race([appCheck, deadline]).finally(mountApp);
});
