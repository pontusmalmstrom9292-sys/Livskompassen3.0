import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onReset?: () => void;
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
        <div className="rounded-xl border border-danger/30 bg-surface/40 p-4 text-center">
          <p className="text-sm text-danger">Något gick fel i vyn.</p>
          <p className="mt-1 text-xs text-text-muted">
            Din text kan redan vara sparad — kolla Arkiv-fliken.
          </p>
          <button
            type="button"
            className="btn-pill--accent mt-3"
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset?.();
            }}
          >
            Ny post
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
