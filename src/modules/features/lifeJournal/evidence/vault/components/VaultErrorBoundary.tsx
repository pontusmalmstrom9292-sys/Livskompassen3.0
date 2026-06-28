import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/design-system';

type Props = {
  children: ReactNode;
  onReset?: () => void;
};

type State = { hasError: boolean };

/** Fångar render-krasch i Valv — vit skärm → återställning utan att tappa PIN-session. */
export class VaultErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Valv] render error', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-danger/30 bg-surface/40 p-4 text-center">
          <p className="text-sm text-danger">Något gick fel i Valv-vyn.</p>
          <p className="mt-1 text-xs text-text-muted">
            Dina sparade bevis påverkas inte — prova att ladda om sidan om felet kvarstår.
          </p>
          <Button
            variant="accent"
            className="mt-3"
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset?.();
            }}
          >
            Försök igen
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
