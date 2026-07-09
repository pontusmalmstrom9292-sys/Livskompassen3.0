import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback, type ErrorFallbackGlow } from '@/design-system';

type Props = {
  children: ReactNode;
  onReset?: () => void;
  glow?: ErrorFallbackGlow;
};

type State = { hasError: boolean };

/** Fångar render-krasch i reflektion-wizard — vit skärm → återställning. */
export class DagbokWizardErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Dagbok] wizard render error', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title="Något gick fel i vyn"
          body="Din text kan redan vara sparad — kolla Arkiv-fliken."
          glow={this.props.glow ?? 'gold'}
          retryLabel="Ny post"
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
