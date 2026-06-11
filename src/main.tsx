import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { applyDefaultTheme } from './modules/core/theme';
import { initAppCheck } from './modules/core/firebase/appCheck';
import App from './App.tsx';

applyDefaultTheme();

void initAppCheck().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
});
