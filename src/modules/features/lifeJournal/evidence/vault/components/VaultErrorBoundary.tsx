import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback } from '@/design-system';

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
        <ErrorFallback
          title="Något gick fel i Valv-vyn"
          body="Dina sparade bevis påverkas inte — prova att ladda om sidan om felet kvarstår."
          glow="danger"
          onRetry={() => {
            this.setState({ hasError: false });
            this.props.onReset?.();
          }}
        />
      );
    }
    return this.props.children;
  }
}
