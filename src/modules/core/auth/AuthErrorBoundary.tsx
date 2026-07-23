import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/design-system';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

/** Fångar render-krasch efter auth-boot — undviker vit skärm utan fallback. */
export class AuthErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[AuthErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-text-muted">
            Något gick fel vid inloggning. Prova att ladda om sidan.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            onClick={() => window.location.reload()}
          >
            Ladda om
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
