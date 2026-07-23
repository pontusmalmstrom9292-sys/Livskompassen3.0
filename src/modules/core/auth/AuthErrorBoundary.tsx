import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/design-system';
import { auth } from '../firebase/init';
import { signOut } from 'firebase/auth';
import { disableAppUnlock } from './appUnlock';
import { clearAppUnlockSession } from './appUnlockPrefs';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  errorMessage: string | null;
  clearing: boolean;
};

/** Fångar render-krasch efter auth-boot — undviker vit skärm utan fallback. */
export class AuthErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: null, clearing: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      errorMessage: error?.message?.slice(0, 180) || null,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[AuthErrorBoundary]', error, info.componentStack);
    // #region agent log
    const data = {
      message: error?.message?.slice(0, 200) ?? null,
      name: error?.name ?? null,
      stackTop: error?.stack?.split('\n').slice(0, 4).join(' | ') ?? null,
      componentStackTop: info.componentStack?.split('\n').slice(0, 6).join(' | ') ?? null,
    };
    console.warn('[DBG-4bae45]', 'AuthErrorBoundary.tsx:catch', 'auth render crash', data);
    fetch('http://127.0.0.1:7891/ingest/e2aa352c-17db-4fb0-8a3f-df79408d16d3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4bae45' },
      body: JSON.stringify({
        sessionId: '4bae45',
        runId: 'pre-fix',
        hypothesisId: 'F',
        location: 'AuthErrorBoundary.tsx:catch',
        message: 'auth render crash',
        data,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, errorMessage: null, clearing: false });
  };

  private handleClearSession = (): void => {
    this.setState({ clearing: true });
    void (async () => {
      try {
        disableAppUnlock();
        clearAppUnlockSession();
        await signOut(auth);
      } catch (err) {
        console.warn('[AuthErrorBoundary] clear session failed', err);
      } finally {
        window.location.assign('/');
      }
    })();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-text-muted">
            Något gick fel vid inloggning. Prova att ladda om sidan.
          </p>
          {this.state.errorMessage ? (
            <p className="max-w-sm break-words text-xs text-text-muted/80" role="status">
              {this.state.errorMessage}
            </p>
          ) : null}
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              className="min-h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={this.handleRetry}
              disabled={this.state.clearing}
            >
              Försök igen
            </Button>
            <Button
              type="button"
              variant="accent"
              className="min-h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={this.handleClearSession}
              disabled={this.state.clearing}
            >
              {this.state.clearing ? 'Rensar…' : 'Rensa inloggning'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={() => window.location.reload()}
              disabled={this.state.clearing}
            >
              Ladda om
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
